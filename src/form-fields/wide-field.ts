import {html, TemplateResult, property} from 'lit-element';
import {BaseField} from './base-field';
import '@polymer/paper-input/paper-textarea';

export class WideField extends BaseField<string> {
  @property() label: string = '';
  @property() placeholder: string = '';
  protected render(): TemplateResult {
    return html`
      <paper-textarea
        class="wide-input disabled-as-readonly form-control"
        always-float-label
        .value="${this.value}"
        label="${this.label}"
        placeholder="${this.isReadonly ? '—' : this.placeholder}"
        ?required="${this.required}"
        ?disabled="${this.isReadonly}"
        ?invalid="${this.errorMessage}"
        error-message="${this.errorMessage}"
        @value-changed="${({detail}: CustomEvent) => this.valueChanged(detail.value)}"
      >
      </paper-textarea>
    `;
  }

  protected controlTemplate(): TemplateResult {
    return html``;
  }

  protected customValidation(): string | null {
    return null;
  }
}
