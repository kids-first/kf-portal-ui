import React from 'react';
import { compose } from 'recompose';
import styled, { css } from 'react-emotion';
import { withTheme } from 'emotion-theming';
import DownloadIcon from 'icons/DownloadIcon';
import { TealActionButton } from 'uikit/Button';
import { disabledButtonStyles } from './Button';

const StyledActionButton = styled(TealActionButton)`
  justify-content: flex-start;
  ${({ disabled }) => (disabled ? disabledButtonStyles : null)}
`;

const DownloadButton = compose(withTheme)(
  ({
    onClick,
    theme,
    content = () => 'Download',
    buttonRef = React.createRef(),
    disabled,
    ...rest
  }) => {
    return (
      <StyledActionButton
        m={'3px'}
        onClick={onClick}
        innerRef={ref => {
          buttonRef.current = ref;
        }}
        disabled={disabled}
        {...rest}
      >
        <DownloadIcon
          fill={disabled ? theme.borderGrey : 'white'}
          className={css`
            margin-right: 9px;
          `}
        />
        <span css={theme.uppercase}>{content()}</span>
      </StyledActionButton>
    );
  },
);

export default DownloadButton;
