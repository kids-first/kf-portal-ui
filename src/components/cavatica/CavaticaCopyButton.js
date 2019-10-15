import * as React from 'react';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';
import styled from 'react-emotion';

import Row from 'uikit/Row';
import CavaticaOpenModalWrapper from './CavaticaOpenModalWrapper';
import { BigWhiteButton, disabledButtonStyles } from 'uikit/Button';
import CavaticaLogo from 'icons/CavaticaLogo';

const ButtonContent = styled(Row)`
  ${({ theme }) => theme.center};

  padding: 0 5px;
  & img {
    width: 20px;
  }
`;

const CavaticaButton = styled(BigWhiteButton)`
  background: ${({ theme, disabled }) => (disabled ? theme.greyScale8 : theme.primary)};
  width: 100%;
  &:hover {
    background-color: ${({ theme, disabled }) =>
      disabled ? theme.greyScale8 : theme.primaryLight};
  }
  text-transform: uppercase;
  font-weight: 600;
  color: ${({ theme }) => theme.white};
  text-align: center;
  font-size: 12px;
  letter-spacing: 0.2px;

  ${({ buttonStyle }) => (buttonStyle ? buttonStyle : null)}
  ${({ disabled }) =>
    disabled ? disabledButtonStyles : null}
`;

export default compose(withTheme)(
  ({
    disabled,
    theme,
    text,
    buttonStyle,
    fileIds,
    sqon,
    hasFilePermission,
    file,
    sourceLocation = '',
  }) => (
    <CavaticaOpenModalWrapper
      fileIds={fileIds}
      sqon={sqon}
      source={{ location: sourceLocation, hasAccess: hasFilePermission, file }}
    >
      <CavaticaButton disabled={disabled} buttonStyle={buttonStyle}>
        <ButtonContent>
          <CavaticaLogo
            width="28"
            fill={disabled ? theme.borderGrey : 'white'}
            style={{ marginRight: '7px' }}
          />
          {text}
        </ButtonContent>
      </CavaticaButton>
    </CavaticaOpenModalWrapper>
  ),
);
