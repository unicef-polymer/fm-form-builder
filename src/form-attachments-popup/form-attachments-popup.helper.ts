import {StoredAttachment} from './form-attachments-popup.base';

export type AttachmentUploadMiddleware = (uploadedData: any[]) => StoredAttachment[];
export type AttachmentDeleteMiddleware = (attachment: StoredAttachment) => void;
export type AttachmentGetMiddleware = (attachment: StoredAttachment) => StoredAttachment;

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

  private uploadMiddleware: AttachmentUploadMiddleware = FormAttachmentsPopupHelper.DEFAULT_UPLOAD_MIDDLEWARE;
  private deleteMiddleware: AttachmentDeleteMiddleware = FormAttachmentsPopupHelper.DEFAULT_DELETE_MIDDLEWARE;
  private getMiddleware: AttachmentGetMiddleware = FormAttachmentsPopupHelper.DEFAULT_GET_MIDDLEWARE;

  static DEFAULT_UPLOAD_MIDDLEWARE(uploadedData: any[]): StoredAttachment[] {
    return uploadedData
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
  }

  static DEFAULT_DELETE_MIDDLEWARE(_: StoredAttachment): void {}

  static DEFAULT_GET_MIDDLEWARE(attachment: StoredAttachment): StoredAttachment {
    return attachment;
  }

  initialize(uploadUrl: string): void {
    this.uploadUrl = uploadUrl;
  }

  registerMiddleware(
    onUpload: AttachmentUploadMiddleware,
    onDelete: AttachmentDeleteMiddleware,
    onGet: AttachmentGetMiddleware
  ): void {
    this.uploadMiddleware = onUpload;
    this.deleteMiddleware = onDelete;
    this.getMiddleware = onGet;
  }

  applyUploadMiddleware(data: any[]): StoredAttachment[] {
    return this.uploadMiddleware(data);
  }

  applyDeleteMiddleware(data: StoredAttachment): void {
    return this.deleteMiddleware(data);
  }

  applyGetMiddleware(data: StoredAttachment): StoredAttachment {
    return this.getMiddleware(data);
  }
}

const AttachmentsHelper: FormAttachmentsPopupHelper = new FormAttachmentsPopupHelper();
export {AttachmentsHelper};
