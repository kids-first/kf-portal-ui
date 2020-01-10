// import React from 'react';

// import CopyToClipboardIcon from '../icons/CopyToClipboardIcon';

// import { copyToClipboardButton } from './CopyToClipboard.module.css';

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

// const CopyToClipboard = ({ value, copyRef = React.createRef(), ...props }) => (
//   <button
//     className={copyToClipboardButton}
//     {...props}
//     onClick={() => {
//       copyValueToClipboard({ value, copyRef });
//     }}
//   >
//     <CopyToClipboardIcon {...{ fill: '#fff' }} />
//     <span ref={copyRef} className="label">
//       {value}
//     </span>
//   </button>
// );

// export default CopyToClipboard;
