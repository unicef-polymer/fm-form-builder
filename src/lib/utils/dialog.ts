// you need to fire 'response' event on dialog close!
export interface IDialog<D> {
  dialog: string;
  dialogData?: D;
  readonly?: boolean;
}

export interface IDialogResponse<R> {
  response?: R;
  confirmed: boolean;
}

export const DialogStyles: string = `
  <custom-style>
    <style>
      #form-attachments-dialog etools-dialog etools-loading {
        font-size: 14px;
      }
    
      #form-attachments-dialog etools-dialog[no-padding] {
        --etools-dialog-scrollable: {
          padding-top: 0 !important;
        }
      }
    
      #form-attachments-dialog etools-dialog {
        --etools-dialog-primary-color: var(--primary-color);
        --etools-dialog-scrollable: {
          margin-top: 0;
          padding-top: 12px !important;
        }
        --etools-dialog-content: {
          min-height: 80px;
          padding-bottom: 8px !important;
          padding-top: 0px !important;
        }
        --etools-dialog-button-styles: {
          margin-top: 0;
        }
        --etools-dialog-title: {
          padding: 8px 45px 8px 24px;
        }
      }
    
      #form-attachments-dialog etools-dialog > etools-loading {
        margin-bottom: -56px;
      }
    
      #form-attachments-dialog etools-content-panel {
        position: relative;
    
        --ecp-header-title: {
          line-height: 48px;
        }
    
        --ecp-expand-btn: {
          position: absolute;
          top: 3px;
          left: 13px;
          width: 45px;
          height: 45px;
        }
    
        --ecp-header-title: {
          font-weight: 500;
          line-height: 48px;
          padding: 0 30px;
        }
    
        --ecp-header-btns-wrapper: {
          opacity: 1;
        }
      }
    
      #form-attachments-dialog etools-dialog .container {
        padding: 14px;
      }
    
      #form-attachments-dialog etools-dialog .content {
        padding: 0 14px;
      }
    
      #form-attachments-dialog etools-dialog {
        --etools-dialog-confirmation-content: {
          min-height: 0;
          margin-top: 0;
          margin-right: 0;
        }
    
        --etools-dialog-content: {
          width: 100%;
          max-width: 100% !important;
    
          overflow-x: hidden;
          overflow-y: auto;
          display: block;
          margin-top: 0;
        }
      }
    </style>
  </custom-style>
`;

export function openDialog<D, R = any>({dialog, dialogData, readonly}: IDialog<D>): Promise<IDialogResponse<R>> {
  return new Promise((resolve: (detail: IDialogResponse<R>) => any, reject: (e: Error) => any) => {
    const dialogElement: HTMLElement & IDialog<D> = document.createElement(dialog) as HTMLElement & IDialog<D>;
    dialogElement.innerHTML = DialogStyles;
    const body: HTMLBodyElement | null = document.querySelector('body');
    if (body) {
      body.appendChild(dialogElement);
    } else {
      reject(new Error('Body not exist'));
    }
    dialogElement.dialogData = dialogData;
    if (readonly) {
      dialogElement.readonly = readonly;
    }
    dialogElement.addEventListener('response', (e: Event) => {
      const event: CustomEvent<IDialogResponse<R>> = e as CustomEvent<IDialogResponse<R>>;
      resolve(event.detail);
      dialogElement.remove();
    });
  });
}
