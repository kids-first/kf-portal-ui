import * as React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';

import Column from './Column';

const ChipContainer = styled('div')`
  margin-left: 7px;
  display: inline-block;
  padding: 0 10px;
  color: white;
  text-align: center;
  white-space: nowrap;
  font-family: ${({ theme }) => theme.fonts.details};
  background-color: ${({ theme }) => theme.defaultChip};
  border-radius: 11px;
  position: relative;
  min-width: 25px;
  line-height: 25px;
  font-size: 12px;
`;

const Chip = ({ theme, color, ...props }) => (
  <Column style={{ justifyContent: 'center' }}>
    <ChipContainer style={{ backgroundColor: color, ...props.style }}>
      {props.children}
    </ChipContainer>
  </Column>
);

Chip.propTypes = {
  color: PropTypes.string,
};

export default Chip;
