import React from 'react';
import { isNil } from 'lodash';
import styled from 'react-emotion';
import { compose, withState } from 'recompose';

import Row from './Row';

const CheckboxBubble = styled(Row)`
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background-color: ${({ active, theme }) => (active ? theme.optionSelected : theme.white)};
  border: solid 1px ${({ active, theme }) => (active ? theme.active : theme.greyScale4)};
  padding: 10px;
  width: 100%;
  cursor: pointer;
  * {
    cursor: pointer;
  }
`;

export default compose(withState('_active', '_setActive', false))(
  ({
    _active,
    _setActive,
    active,
    isControlled = !isNil(active),
    isActive = isControlled ? active : _active,
    onClick,
    ...props
  }) => (
    <CheckboxBubble
      active={isActive}
      onClick={
        isControlled
          ? onClick
          : () => {
              _setActive(!isActive);
              onClick(!isActive);
            }
      }
      {...props}
    />
  ),
);
