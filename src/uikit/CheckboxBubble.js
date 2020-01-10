import React from 'react';
import cx from 'classnames';
import isNil from 'lodash/isNil';
import { compose, withState } from 'recompose';

import Row from './Row';
import './CheckboxBubble.css';

export default compose(withState('_active', '_setActive', false))(
  ({
    _active,
    _setActive,
    active,
    isControlled = !isNil(active),
    isActive = isControlled ? active : _active,
    onClick,
    className = '',
    ...props
  }) => (
    <Row
      className={cx('checkboxBubble', className, { active: isActive })}
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
