import React from 'react';
import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import { compose } from 'recompose';

import CopyToClipboardIcon from '../icons/CopyToClipboardIcon';

export const copyValueToClipboard = ({ value, copyRef }) => {
  const textArea = document.createElement('textarea');
  textArea.style.position = 'absolute';
  textArea.style.top = '-10000px';
  textArea.style.left = '0px';
  document.body.appendChild(textArea);
  textArea.textContent = value;

  const selection = document.getSelection();
  selection.removeAllRanges();
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);

  const range = document.createRange();
  range.selectNodeContents(copyRef.current);
  selection.removeAllRanges();
  selection.addRange(range);
};

const CopyToClipboard = compose(withTheme)(
  ({
    theme,
    value,
    className,
    buttonType = theme.actionButton,
    copyRef = React.createRef(),
    ...props
  }) => (
    <button
      className={css`
        ${buttonType};
        ${className};
        display: flex;
        justify-content: center;
        align-items: center;
      `}
      {...props}
      onClick={() => {
        copyValueToClipboard({ value, copyRef });
      }}
    >
      <CopyToClipboardIcon {...{ fill: '#fff' }} />
      <span
        ref={copyRef}
        className={css`
          margin-left: 10px;
        `}
      >
        {value}
      </span>
    </button>
  ),
);

export default CopyToClipboard;
