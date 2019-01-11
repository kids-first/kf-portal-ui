import React from 'react';
import { compose } from 'recompose';
import { Trans } from 'react-i18next';
import styled, { css } from 'react-emotion';
import { withTheme } from 'emotion-theming';
import DownloadIcon from 'icons/DownloadIcon';
import { TealActionButton } from 'uikit/Button';
import { DisabledButton } from './Button';

const StyledActionButton = styled(TealActionButton)`
  justify-content: flex-start;
  ${({ disabled }) => (disabled ? DisabledButton : null)}
`;

const DownloadButton = compose(withTheme)(
  ({
    onClick,
    theme,
    content = () => <Trans>Download</Trans>,
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
