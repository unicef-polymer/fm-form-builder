import {css, CSSResult} from 'lit-element';

// language=CSS
export const BaseFieldStyles: CSSResult = css`
  :host {
    display: block;
    width: 100%;
    padding: 0 25px 0 45px;
    box-sizing: border-box;
  }

  .finding-container {
    width: 100%;
    display: flex;
  }
  .flex-wrapping {
    flex-wrap: wrap;
  }

  .question-control,
  .question {
    min-height: 57px;
    display: flex;
    align-items: center;
  }
  .question {
    flex: 2;
  }
  .question-control {
    flex: 3;
  }

  paper-input,
  paper-textarea {
    width: 100%;
  }

  .question-text {
    font-weight: 500;
    font-size: 13px;
    color: var(--primary-text-color);
  }

  @media (max-width: 1080px) {
    :host {
      padding: 0 15px;
    }
    .finding-container {
      flex-direction: column;
    }
    .question,
    .question-control {
      flex: 0 1 auto;
    }
  }
`;
