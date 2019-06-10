import * as React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'emotion-theming';
import styled from 'react-emotion';
import { isEmpty } from 'lodash';

import SecondaryNavTab from './SecondaryNavTab';

  const MenuWrapper = styled('ul')`
    ${({ theme }) => theme.secondaryNav}
  `;

class SecondaryNavMenu extends React.Component {
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
      <MenuWrapper>
        {this.props.tabs.map((tab, i) => (
          <SecondaryNavTab
            key={`${i}_${tab.hash}`}
            name={tab.name}
            target={tab.hash}
            location={this.props.location}
          />
        ))}
      </MenuWrapper>
    );
  }

  ensureValidHash() {}
}

SecondaryNavMenu.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.objectOf({ name: PropTypes.string.isRequired, hash: PropTypes.string.isRequired })
      .isRequired,
  ).isRequired,
  defaultHash: PropTypes.string,
};

export default withTheme(SecondaryNavMenu);
