import {html, TemplateResult, property, CSSResultArray, css} from 'lit-element';
import {BaseField} from './base-field';
import {repeat} from 'lit-html/directives/repeat';
import '@polymer/paper-radio-group/paper-radio-group';
import '@polymer/paper-radio-button/paper-radio-button';
import {PaperRadioButtonElement} from '@polymer/paper-radio-button/paper-radio-button';
import {InputStyles} from '../lib/styles/input-styles';

export type FieldOption = {
  value: any;
  label: string;
};

export class ScaleField extends BaseField<string | null> {
  @property({type: Array}) options: FieldOption[] = [];
  protected controlTemplate(): TemplateResult {
    return html`
      ${InputStyles}
      <div class="container">
        <paper-radio-group
          class="radio-group"
          selected="${this.value}"
          @iron-select="${({detail}: CustomEvent) => this.onSelect(detail.item)}"
        >
          ${repeat(
            this.options,
            (option: FieldOption) => html`
              <paper-radio-button class="radio-button" name="${option.value}">
                ${option.label}
              </paper-radio-button>
            `
          )}
        </paper-radio-group>

        <paper-button ?hidden="${this.isReadonly}" @click="${() => this.valueChanged(null)}" class="clear-button">
          <iron-icon icon="clear"></iron-icon>Clear
        </paper-button>
      </div>
    `;
  }

  protected onSelect(item: PaperRadioButtonElement): void {
    const newValue: string = item.get('name');
    this.valueChanged(newValue);
  }

  protected customValidation(): string | null {
    return null;
  }

  static get styles(): CSSResultArray {
    // language=CSS
    return [
      ...BaseField.styles,
      css`
        .container {
          position: relative;
          min-height: 48px;
          display: flex;
          align-items: center;
          flex-direction: row;
        }

        .radio-group {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
        }

        :host([is-readonly]) paper-radio-group {
          pointer-events: none;
          opacity: 0.55;
        }

        @media (max-width: 1080px) {
          .container {
            flex-direction: column;
            align-items: flex-start;
          }
          .radio-group {
            flex-direction: column;
          }
          .radio-button {
            padding-left: 3px;
          }
          .clear-button {
            margin: 0;
            padding-left: 0;
          }
        }
      `
    ];
  }
}
