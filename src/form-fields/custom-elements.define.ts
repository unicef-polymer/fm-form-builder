/**
 * Form field elements
 */
import {TextField} from './text-field';
import {NumberField} from './number-field';
import {ScaleField} from './scale-field';
import {WideField} from './wide-field';
window.customElements.define('number-field', NumberField);
window.customElements.define('text-field', TextField);
window.customElements.define('scale-field', ScaleField);
window.customElements.define('wide-field', WideField);
