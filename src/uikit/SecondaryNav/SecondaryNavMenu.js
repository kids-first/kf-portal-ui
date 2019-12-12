import * as React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import SecondaryNavTab from './SecondaryNavTab';
import './SecondaryNav.css';

export default class SecondaryNavMenu extends React.Component {
  hashes = [];
  constructor(props) {
    super(props);

    const { tabs } = props;
    tabs.forEach(tab => this.hashes.push(`#${tab.hash}`));
  }

  componentDidMount() {
    const { defaultHash = '', location: { hash } = {} } = this.props;
    if (!this.hashes.includes(hash) && !isEmpty(defaultHash)) {
      window.location.hash = `#${defaultHash}`;
    }
  }

  render() {
    return (
      <ul className="secondaryNav">
        {this.props.tabs.map((tab, i) => (
          <SecondaryNavTab
            key={`${i}_${tab.hash}`}
            name={tab.name}
            target={tab.hash}
            location={this.props.location}
          />
        ))}
      </ul>
    );
  }

  ensureValidHash() {}
}

SecondaryNavMenu.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      hash: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  defaultHash: PropTypes.string,
};
