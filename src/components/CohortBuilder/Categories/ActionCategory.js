import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';

import Column from 'uikit/Column';

export default class ActionCategory extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    onClick: PropTypes.func,
  };

  render() {
    const {
      color = '#FFFFFF',
      title,
      onClick = noop,
      className = '',
      children = null,
    } = this.props;

    return (
      <Column
        className={`category-button ${className}`}
        onClick={onClick}
        style={{
          borderTop: `4px solid ${color}`,
        }}
      >
        <Column alignItems="center">
          {children}
          <h3 className="title">{title}</h3>
        </Column>
      </Column>
    );
  }
}
