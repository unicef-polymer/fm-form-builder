import {css, CSSResultArray, html, TemplateResult} from 'lit-element';
import {BaseField} from './base-field';
import '@polymer/paper-input/paper-input';
import {FlexLayoutClasses} from '../lib/styles/flex-layout-classes';
import {BaseFieldStyles} from '../lib/styles/base-field.styles';

export class NumberField extends BaseField<number> {
  protected controlTemplate(): TemplateResult {
    return html`
      <paper-input
        class="without-border no-padding-left"
        no-label-float
        .value="${this.value}"
        @value-changed="${({detail}: CustomEvent) => this.valueChanged(detail.value)}"
        placeholder="&#8212;"
        ?invalid="${this.errorMessage}"
        error-message="${this.errorMessage}"
        ?disabled="${this.isReadonly}"
      >
      </paper-input>
    `;
  }

  protected valueChanged(newValue: number): void {
    const formatted: number = Number(newValue);
    const isNumber: boolean = !isNaN(formatted) && `${newValue}` !== '' && `${newValue}` !== 'null';
    super.valueChanged(isNumber ? formatted : newValue);
  }

  protected customValidation(value: number): string | null {
    return value && isNaN(value) ? 'Must be a number' : null;
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
