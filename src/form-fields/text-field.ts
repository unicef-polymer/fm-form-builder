import {css, CSSResultArray, html, TemplateResult} from 'lit-element';
import {BaseField} from './base-field';
import '@polymer/paper-input/paper-textarea';
import {FlexLayoutClasses} from '../lib/styles/flex-layout-classes';
import {BaseFieldStyles} from '../lib/styles/base-field.styles';

export class TextField extends BaseField<string> {
  protected controlTemplate(): TemplateResult {
    return html`
      <paper-textarea
        id="textarea"
        class="without-border no-padding-left"
        no-label-float
        .value="${this.value}"
        @value-changed="${({detail}: CustomEvent) => this.valueChanged(detail.value)}"
        placeholder="&#8212;"
        ?disabled="${this.isReadonly}"
        ?invalid="${this.errorMessage}"
        error-message="${this.errorMessage}"
      >
      </paper-textarea>
    `;
  }

  protected customValidation(): string | null {
    return null;
  }

  static get styles(): CSSResultArray {
    // language=CSS
    return [
      FlexLayoutClasses,
      BaseFieldStyles,
      css`
        @media (max-width: 380px) {
          .no-padding-left {
            padding-left: 0;
          }
        }
      `
    ];
  }
}
