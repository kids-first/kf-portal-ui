import React, { Fragment } from 'react';
import Dropdown from 'uikit/Dropdown';
import { Trans } from 'react-i18next';
import { compose, withState, withHandlers } from 'recompose';
import { DropdownLink, NavbarDropdownWrapper, NavbarDropdownOptionsContainer } from './ui';

const AppsMenu = ({ isDropdownVisible, toggleDropdown, setDropdownVisibility }) => (
  <Dropdown
    align="left"
    isOpen={isDropdownVisible}
    onToggle={toggleDropdown}
    onOuterClick={() => setDropdownVisibility(false)}
    items={[
      <DropdownLink onClick={toggleDropdown} to={'/'}>
        <Trans>Data Resource Portal</Trans>
      </DropdownLink>,
      <DropdownLink onClick={toggleDropdown} to={'https://kidsfirstdrc.org/'}>
        <Trans>Website</Trans>
      </DropdownLink>,
      <DropdownLink
        onClick={toggleDropdown}
        to={'https://kidsfirstdrc.org/support/getting-started/'}
      >
        <Trans>Support</Trans>
      </DropdownLink>,
      <DropdownLink onClick={toggleDropdown} to={'https://kidsfirstdrc.org/contact'}>
        <Trans>Contact</Trans>
      </DropdownLink>,
    ]}
  >
    <div>Kids First</div>
  </Dropdown>
);

export default compose(
  withState('isDropdownVisible', 'setDropdownVisibility', false),
  withHandlers({
    toggleDropdown: ({ isDropdownVisible, setDropdownVisibility }) => e => {
      setDropdownVisibility(!isDropdownVisible);
    },
  }),
)(AppsMenu);
