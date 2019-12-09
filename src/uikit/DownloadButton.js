import React from 'react';

import DownloadIcon from 'icons/DownloadIcon';
import { TealActionButton } from 'uikit/Button';

const DownloadButton = ({
  onClick,
  content = () => 'Download',
  buttonRef = React.createRef(),
  disabled,
  ...props
}) => {
  return (
    <TealActionButton
      className="download-button"
      onClick={onClick}
      innerRef={ref => {
        buttonRef.current = ref;
      }}
      disabled={disabled}
      {...props}
    >
      <DownloadIcon
        fill={disabled ? '#cacbcf' : 'white'}
        width="13px"
        height="28px"
        style={{ marginRight: '9px' }}
      />
      <span style={{ textTransform: 'uppercase' }}>{content()}</span>
    </TealActionButton>
  );
};

export default DownloadButton;
