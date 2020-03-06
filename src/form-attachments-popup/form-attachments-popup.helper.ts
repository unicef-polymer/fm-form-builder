import {StoredAttachment} from './form-attachments-popup.base';

export type AttachmentUploadMiddleware = (uploadedData: any[]) => Promise<StoredAttachment[]>;
export type AttachmentDeleteMiddleware = (attachment: StoredAttachment) => void;
export type AttachmentGetMiddleware = (attachment: StoredAttachment) => Promise<StoredAttachment>;

export type AttachmentFromEtoolsUpload = {
  agreement_reference_number: string;
  attachment: number;
  created: string;
  file_link: string;
  file_type: string;
  filename: string;
  id: number;
  object_link: string;
  partner: string;
  partner_type: string;
  pd_ssfa: null;
  pd_ssfa_number: string;
  source: string;
  uploaded_by: string;
  vendor_number: string;
};

class FormAttachmentsPopupHelper {
  get isInitialized(): boolean {
    return Boolean(this.uploadUrl);
  }
  uploadUrl: string | null = null;

  /**
   * uploadMiddleware is applied after etools-upload-multi @upload-finished event with event.detail.success
   * In simple case it just parses uploaded attachments and returns StoredAttachment data (as in DEFAULT_UPLOAD_MIDDLEWARE)
   * Provide custom middleware for cases when some action with returned data needed
   * (For instance reading returned file, saving it in some storage.)
   * You need to resolve StoredAttachment[] data with attachment id/url or hash
   * (which can be replaced with id later, using registered getMiddleware)
   */
  private uploadMiddleware: AttachmentUploadMiddleware = FormAttachmentsPopupHelper.DEFAULT_UPLOAD_MIDDLEWARE;
  /**
   * deleteMiddleware will be called on attachments delete with it data.
   */
  private deleteMiddleware: AttachmentDeleteMiddleware = FormAttachmentsPopupHelper.DEFAULT_DELETE_MIDDLEWARE;
  private getMiddleware: AttachmentGetMiddleware = FormAttachmentsPopupHelper.DEFAULT_GET_MIDDLEWARE;

  static DEFAULT_UPLOAD_MIDDLEWARE(uploadedData: any[]): Promise<StoredAttachment[]> {
    return new Promise((resolve: (value: StoredAttachment[]) => void) => {
      const data: StoredAttachment[] = uploadedData
        .map((data: any) => (typeof data === 'string' ? JSON.parse(data) : data))
        .map((data: AttachmentFromEtoolsUpload) => {
          const {file_link, attachment, filename} = data;
          if (!file_link || !attachment || !filename) {
            console.warn('Missing fields in parsed attachment');
            return null;
          } else {
            return {
              url: file_link,
              attachment,
              filename,
              file_type: null
            } as StoredAttachment;
          }
        })
        .filter<StoredAttachment>((attachment: StoredAttachment | null): attachment is StoredAttachment =>
          Boolean(attachment)
        );
      resolve(data);
    });
  }

  static DEFAULT_DELETE_MIDDLEWARE(_: StoredAttachment): void {}

  static DEFAULT_GET_MIDDLEWARE(attachment: StoredAttachment): Promise<StoredAttachment> {
    return Promise.resolve(attachment);
  }

  initialize(uploadUrl: string): void {
    this.uploadUrl = uploadUrl;
  }

  registerMiddleware(
    onUpload: AttachmentUploadMiddleware,
    onDelete: AttachmentDeleteMiddleware,
    onGet?: AttachmentGetMiddleware
  ): void {
    this.uploadMiddleware = onUpload;
    this.deleteMiddleware = onDelete;
    this.getMiddleware = onGet || FormAttachmentsPopupHelper.DEFAULT_GET_MIDDLEWARE;
  }

  applyUploadMiddleware(data: any[]): Promise<StoredAttachment[]> {
    return this.uploadMiddleware(data);
  }

  applyDeleteMiddleware(data: StoredAttachment): void {
    return this.deleteMiddleware(data);
  }

  applyGetMiddleware(data: StoredAttachment): Promise<StoredAttachment> {
    return this.getMiddleware(data);
  }
}

const AttachmentsHelper: FormAttachmentsPopupHelper = new FormAttachmentsPopupHelper();
export {AttachmentsHelper};
