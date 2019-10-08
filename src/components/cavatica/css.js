import { css } from 'emotion';

export const cssCopyModalRoot = theme => {
  return css`
  .wrapper {
    border-radius: 10px;
    background-color: #ffffff;
    border: solid 1px #cacbcf;
  
    input:focus,
    select:focus,
    textarea:focus,
    button:focus {
      outline: none;
    }
  }
  
  div.verticalCenter {
    display:flex;
    flex-direction:vertical:
    align-items:center;
  }
  
  div.content {
    margin: 1em 0em;
    ${theme.column}
  }
  
  }
  `;
};
