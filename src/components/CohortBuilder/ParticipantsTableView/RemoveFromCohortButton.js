import React from 'react';
import styled from 'react-emotion';

import { BigWhiteButton } from 'uikit/Button';
import RemoveFromCohortIcon from './RemoveFromCohortIcon';

const StyledWhiteButton = styled(BigWhiteButton)`
  color: ${({ theme }) => theme.lightBlue};
  line-height: 26px;
  margin-left: 5px;
  padding-left: 8px;
  padding-right: 12px;

  &[disabled],
  &.disabled {
    color: ${({ theme }) => theme.greyScale11};
    background-color: ${({ theme }) => theme.backgroundGrey};
    border-color: ${({ theme }) => theme.borderGrey};
  }

  .rfc-button-text {
    font-family: ${({ theme }) => theme.fonts.default};
    font-size: 12px;
    font-weight: 600;
    padding-left: 5px;
  }
`;

const RemoveFromCohortButton = ({ iconStyle = {}, ...rest }) => (
  <StyledWhiteButton {...rest}>
    <RemoveFromCohortIcon
      style={{
        width: '22px',
        height: '22px',
        position: 'relative',
        top: '2px',
      }}
    />
    <span className="rfc-button-text">REMOVE FROM COHORT</span>
  </StyledWhiteButton>
);

export default RemoveFromCohortButton;
