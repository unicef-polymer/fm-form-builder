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

export class FormAttachmentsPopupHelper {
  get isInitialized(): boolean {
    return Boolean(this.uploadUrl);
  }
  uploadUrl: string | null = null;

  initialize(uploadUrl: string): void {
    this.uploadUrl = uploadUrl;
  }
}

const AttachmentsHelper: FormAttachmentsPopupHelper = new FormAttachmentsPopupHelper();
export {AttachmentsHelper};
