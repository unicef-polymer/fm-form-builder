import {css, CSSResultArray, LitElement, property, query, TemplateResult} from 'lit-element';
import {GenericObject} from '../lib/types/global.types';
import {BlueprintMetadata} from '../lib/types/form-builder.types';
import {clone} from 'ramda';
import {template} from './form-attachments-popup.tpl';
import {fireEvent} from '../lib/utils/fire-custom-event';
import {SharedStyles} from '../lib/styles/shared-styles';
import {AttachmentsStyles} from '../lib/styles/attachments.styles';
import {AttachmentsHelper} from './form-attachments-popup.helper';
import {deleteFileFromDexie} from '@unicef-polymer/etools-upload/offline/dexie-operations';

export type FormBuilderAttachmentsPopupData = {
  attachments: StoredAttachment[];
  metadata: BlueprintMetadata;
  title: string;
  readonly?: boolean;
  computedPath: string[];
};

export type StoredAttachment = {
  attachment: string | number;
  filename: string;
  file_type: number | null;
  url?: string;
  composedPath?: string[];
};

export type UploadedAttachment = {
  id: number;
  object_link: string;
  file_type: string;
  file_link: string;
  filename: string;
  uploaded_by: string;
  created: string;
  attachment: number;
};

export type OfflineSavedAttachment = {
  id: string;
  filetype: string;
  filename: string;
  extraInfo: string[];
  unsynced: boolean;
};

type UploadFinishedDetails = {
  success: (UploadedAttachment | OfflineSavedAttachment)[];
  error: any[];
};

export class FormAttachmentsPopup extends LitElement {
  @property() dialogOpened: boolean = true;
  @property() saveBtnClicked: boolean = false;
  @property() attachments: StoredAttachment[] = [];
  @property() metadata!: BlueprintMetadata;
  readonly: boolean = false;
  popupTitle: string = '';
  computedPath: string[] = [];

  @query('#link') link!: HTMLLinkElement;

  /**
   * Array of offline saved fileIds that was remove from popup.
   * We need to remove them from IDB but only after confirm button click
   */
  private filesForRemove: string[] = [];
  private originalAttachments: (string | number)[] = [];

  set dialogData({attachments, title, metadata, readonly, computedPath}: FormBuilderAttachmentsPopupData) {
    this.popupTitle = title;
    this.attachments = clone(attachments) || [];
    this.originalAttachments = (attachments || []).map(({attachment}: StoredAttachment) => attachment);
    this.metadata = clone(metadata);
    this.readonly = Boolean(readonly);
    this.computedPath = computedPath;
  }

  get uploadUrl(): string {
    return AttachmentsHelper.uploadUrl!;
  }

  get jwtLocalStorageKey(): string {
    return AttachmentsHelper.jwtLocalStorageKey!;
  }

  constructor() {
    super();
    if (!AttachmentsHelper.isInitialized) {
      throw new Error('Please initialize attachments popup before use');
    }
  }

  render(): TemplateResult | void {
    return template.call(this);
  }

  /**
   * on Cancel button click
   * Remove offline saved attachments from IDB if they are missing in originalAttachments
   */
  onClose(): void {
    this.attachments.forEach(({url, attachment}: StoredAttachment) => {
      const existsInOriginal: boolean = this.originalAttachments.includes(attachment);
      if (!existsInOriginal && !url) {
        deleteFileFromDexie(attachment as string);
      }
    });
    fireEvent(this, 'response', {confirmed: false});
  }

  saveChanges(): void {
    const fileTypeNotSelected: boolean = this.attachments.some((attachment: GenericObject) => !attachment.file_type);
    if (fileTypeNotSelected) {
      return;
    }

    if (this.filesForRemove.length) {
      this.filesForRemove.forEach((fileId: string) => deleteFileFromDexie(fileId));
    }

    /**
     * Don't confirm popup if no changes was made
     */
    const isDataEquals: boolean =
      this.attachments.every(
        ({attachment}: StoredAttachment, index: number) => this.originalAttachments[index] === attachment
      ) && this.attachments.length === this.originalAttachments.length;

    if (!isDataEquals) {
      fireEvent(this, 'response', {confirmed: true, attachments: this.attachments});
    } else {
      fireEvent(this, 'response', {confirmed: false});
    }
  }

  protected downloadFile(attachment: GenericObject): void {
    const url: string = attachment.url;
    this.link.href = url;
    this.link.click();
    window.URL.revokeObjectURL(url);
  }

  protected changeFileType(attachment: GenericObject, newType: number | null): void {
    if (newType && attachment.file_type !== newType) {
      attachment.file_type = newType;
      this.performUpdate();
    }
  }

  protected attachmentsUploaded({success, error}: UploadFinishedDetails): void {
    const parsedAttachments: StoredAttachment[] = success
      .map((attachment: UploadedAttachment | OfflineSavedAttachment) => {
        if (this.isUploadedAttachment(attachment)) {
          return {
            url: attachment.file_link,
            attachment: attachment.id,
            filename: attachment.filename,
            file_type: null
          } as StoredAttachment;
        } else if (this.isOfflineSavedAttachment(attachment)) {
          return {
            attachment: attachment.id,
            filename: attachment.filename,
            composedPath: this.computedPath,
            file_type: null
          } as StoredAttachment;
        } else {
          console.warn('Missing fields in parsed attachment');
          return null;
        }
      })
      .filter<StoredAttachment>((attachment: StoredAttachment | null): attachment is StoredAttachment =>
        Boolean(attachment)
      );
    this.attachments = [...this.attachments, ...parsedAttachments];

    if (error && error.length) {
      console.error(error);
      fireEvent(this, 'toast', {text: 'Can not upload attachments. Please try again later'});
    }
  }

  protected deleteAttachment(index: number): void {
    const [attachment] = this.attachments.splice(index, 1);
    if (!attachment.hasOwnProperty('url')) {
      /**
       * prepare attachment for remove from IDB after Popup confirm
       */
      this.filesForRemove.push(attachment.attachment as string);
    }
    this.performUpdate();
  }

  private isUploadedAttachment(
    attachment: UploadedAttachment | OfflineSavedAttachment
  ): attachment is UploadedAttachment {
    return (
      attachment.hasOwnProperty('filename') &&
      attachment.hasOwnProperty('id') &&
      attachment.hasOwnProperty('file_link') &&
      !attachment.hasOwnProperty('unsynced')
    );
  }

  private isOfflineSavedAttachment(
    attachment: UploadedAttachment | OfflineSavedAttachment
  ): attachment is OfflineSavedAttachment {
    return (
      attachment.hasOwnProperty('filename') && attachment.hasOwnProperty('id') && attachment.hasOwnProperty('unsynced')
    );
  }

  static get styles(): CSSResultArray {
    // language=CSS
    return [
      SharedStyles,
      AttachmentsStyles,
      css`
        .file-selector__type-dropdown {
          flex-basis: 25%;
          padding-left: 8px;
          padding-right: 8px;
        }
        .file-selector__filename {
          flex-basis: 35%;
        }
        .file-selector__download {
          flex-basis: 10%;
        }
        .file-selector__delete {
          flex-basis: 10%;
        }
        .file-selector-container.with-type-dropdown {
          flex-wrap: nowrap;
        }
        .popup-container {
          padding: 12px 12px 0;
        }
        @media (max-width: 380px) {
          .file-selector-container.with-type-dropdown {
            justify-content: center;
          }
          .file-selector-container.with-type-dropdown etools-dropdown.type-dropdown {
            flex-basis: 90%;
          }
          .file-selector__filename {
            flex-basis: 90%;
          }
          .file-selector__download {
            flex-basis: 5%;
          }
          .file-selector__delete {
            flex-basis: 5%;
          }
        }
        @media (max-width: 600px) {
          etools-dropdown {
            padding: 0;
          }
          .file-selector-container.with-type-dropdown {
            border-bottom: 1px solid lightgrey;
            flex-wrap: wrap;
            padding-bottom: 10px;
          }
        }
      `
    ];
  }
}
