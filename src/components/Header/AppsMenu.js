import React, { Fragment } from 'react';
import Dropdown from 'uikit/Dropdown';
import { Trans } from 'react-i18next';
import { compose, withState, withHandlers } from 'recompose';
import styled from 'react-emotion';
import {
  NavbarDropdownWrapper,
  NavbarKidsFirstDropdown,
  AllAppsRow,
  DropdownExternalLink,
} from './ui';
import AllAppsContact from '../../icons/AllAppsContact';
import AllAppsSupport from '../../icons/AllAppsSupport';
import AllAppsWebsite from '../../icons/AllAppsWebsite';
import AllAppsPortal from '../../icons/AllAppsPortal';
import AllAppsMenu from '../../icons/AllAppsMenu';
import { DropdownChevron } from '../../uikit/Dropdown/ui';

const KidsFirstMenu = ({ isDropdownVisible }) => {
  const color = isDropdownVisible ? '#e83a9c' : '#a42c90';
  return (
    <AllAppsRow alignItems="center" height={'55px'}>
      <AllAppsMenu width="14px" height="14px" fill={color} />{' '}
      <span
        css={`
          color: ${color};
        `}
      >
        Kids First
      </span>
    </AllAppsRow>
  );
};

const DropdownArrow = styled(DropdownChevron)`
  width: 9px;
  margin-left: 7px;
  margin-right: 12px;
  transform: rotate(${({ isOpen }) => (isOpen ? 180 : 0)}deg);
  transition: transform 0.2s;
  fill: ${({ isOpen }) => (isOpen ? '#e83a9c' : '#a42c90')};
`;

const AppsMenu = ({ isDropdownVisible, toggleDropdown, setDropdownVisibility }) => (
  <Dropdown
    align="left"
    isOpen={isDropdownVisible}
    onToggle={toggleDropdown}
    onOuterClick={() => setDropdownVisibility(false)}
    items={[
      <DropdownExternalLink onClick={toggleDropdown}>
        <AllAppsRow
          alignItems="center"
          css={`
            color: #e83a9c;
          `}
        >
          <AllAppsPortal width="12px" height="14px" fill="#e83a9c" />
          <Trans>Data Resource Portal</Trans>
        </AllAppsRow>
      </DropdownExternalLink>,
      <DropdownExternalLink
        onClick={toggleDropdown}
        href="https://kidsfirstdrc.org/"
        target="_blank"
      >
        <AllAppsRow alignItems="center">
          <AllAppsWebsite width="14px" height="13px" />
          <Trans>Website</Trans>
        </AllAppsRow>
      </DropdownExternalLink>,
      <DropdownExternalLink
        onClick={toggleDropdown}
        href="https://kidsfirstdrc.org/support/getting-started/"
        target="_blank"
      >
        <AllAppsRow alignItems="center">
          <AllAppsSupport width="15px" height="15px" />
          <Trans>Support</Trans>
        </AllAppsRow>
      </DropdownExternalLink>,
      <DropdownExternalLink onClick={toggleDropdown} href="https://kidsfirstdrc.org/contact">
        <AllAppsRow alignItems="center">
          <AllAppsContact width="16px" height="11px" />
          <Trans>Contact</Trans>
        </AllAppsRow>
      </DropdownExternalLink>,
    ]}
    ItemWrapperComponent={props => <Fragment {...props} />}
    ContainerComponent={NavbarDropdownWrapper}
    OptionsContainerComponent={NavbarKidsFirstDropdown}
    DropdownArrow={DropdownArrow}
  >
    <KidsFirstMenu isDropdownVisible={isDropdownVisible} />
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
