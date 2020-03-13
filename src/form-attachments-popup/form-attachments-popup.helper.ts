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
