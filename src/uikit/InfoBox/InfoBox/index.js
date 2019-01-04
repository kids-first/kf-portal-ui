import React from 'react';
import styled from 'react-emotion';
import PropTypes from 'prop-types';

import Column from 'uikit/Column';

const Info = styled(Column)`
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.greyScale5};
  font-family: ${({ theme }) => theme.fonts.default};
  padding: 20px;
  flex-basis: 0;
  flex: 1;

  ${({ styles }) => (styles ? styles : null)};
`;

const Value = styled('div')`
  font-weight: 600;
  font-size: 18px;
  color: ${({ theme }) => theme.greyScale1};
  margin-bottom: 2px;
`;

const Description = styled('div')`
  font-size: 13px;
  color: ${({ theme }) => theme.greyScale9};
`;

const InfoBox = ({ value, description, styles }) => (
  <Info styles={styles}>
    <Value>{typeof value === 'number' ? value.toLocaleString() : null}</Value>
    <Description>{description}</Description>
  </Info>
);

InfoBox.propTypes = {
  value: PropTypes.oneOfType(PropTypes.string, PropTypes.number),
  description: PropTypes.string.isRequired,
};

export default InfoBox;
