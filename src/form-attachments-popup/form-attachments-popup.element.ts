import {customElement} from 'lit-element';
import {FormAttachmentsPopup, StoredAttachment} from './form-attachments-popup.base';
import {AttachmentsHelper} from './form-attachments-popup.helper';
import {fireEvent} from '../lib/utils/fire-custom-event';

@customElement('form-attachments-popup')
export class FormAttachmentsPopupElement extends FormAttachmentsPopup {
  get uploadUrl(): string {
    return AttachmentsHelper.uploadUrl!;
  }

  constructor() {
    super();
    if (!AttachmentsHelper.isInitialized) {
      throw new Error('Please initialize attachments popup before use');
    }
  }

  protected async attachmentsUploaded(attachments: {success: string[]; error: string[]}): Promise<void> {
    try {
      const parsedAttachments: StoredAttachment[] = await AttachmentsHelper.applyUploadMiddleware(
        attachments.success,
        this.computedPath
      );
      this.attachments = [...this.attachments, ...parsedAttachments];
    } catch (e) {
      console.error(e);
      fireEvent(this, 'toast', {text: 'Can not upload attachments. Please try again later'});
    }
  }

  protected deleteAttachment(index: number): void {
    const [attachment] = this.attachments.splice(index, 1);
    AttachmentsHelper.applyDeleteMiddleware(attachment);
    this.performUpdate();
  }
}
