import React, { Fragment } from 'react';
import Dropdown from 'uikit/Dropdown';
import { Trans } from 'react-i18next';
import {
  NavbarDropdownWrapper,
  NavbarKidsFirstDropdown,
  DropdownExternalLink,
  DropdownRow,
  MenuLabelContainer,
} from './ui';
import AllAppsContactIcon from 'icons/AllAppsContactIcon';
import AllAppsSupportIcon from 'icons/AllAppsSupportIcon';
import AllAppsWebsiteIcon from 'icons/AllAppsWebsiteIcon';
import AllAppsPortalIcon from 'icons/AllAppsPortalIcon';
import AllAppsMenuIcon from 'icons/AllAppsMenuIcon';
import AllAppsStudiesIcon from 'icons/AllAppsStudiesIcon';
import { hocToRenderProps } from 'services/utils';
import { withDropdownState } from 'uikit/Dropdown/';

export const DropDownState = hocToRenderProps(withDropdownState);

export default () => (
  <DropDownState
    render={({ isDropdownVisible, toggleDropdown, setDropdownVisibility }) => (
      <Dropdown
        align="left"
        isOpen={isDropdownVisible}
        onToggle={toggleDropdown}
        onOuterClick={() => setDropdownVisibility(false)}
        items={[
          <DropdownExternalLink
            hasExternalIcon={false}
            onClick={toggleDropdown}
            borderColor={'#c03299'}
          >
            <DropdownRow alignItems="center" color={'#c03299'}>
              <AllAppsPortalIcon width="12px" height="14px" fill="#c03299" />
              <Trans>Data Resource Portal</Trans>
            </DropdownRow>
          </DropdownExternalLink>,
          <DropdownExternalLink
            hasExternalIcon={false}
            onClick={toggleDropdown}
            href="https://kidsfirstdrc.org/"
            target="_blank"
          >
            <DropdownRow alignItems="center">
              <AllAppsWebsiteIcon width="14px" height="13px" />
              <Trans>Website</Trans>
            </DropdownRow>
          </DropdownExternalLink>,
          <DropdownExternalLink
            hasExternalIcon={false}
            onClick={toggleDropdown}
            href="https://kidsfirstdrc.org/support/studies-and-access/"
            target="_blank"
          >
            <DropdownRow alignItems="center">
              <AllAppsStudiesIcon width="15" height="15" />
              <Trans>Studies and Access</Trans>
            </DropdownRow>
          </DropdownExternalLink>,
          <DropdownExternalLink
            hasExternalIcon={false}
            onClick={toggleDropdown}
            href="https://kidsfirstdrc.org/support/getting-started/"
            target="_blank"
          >
            <DropdownRow alignItems="center">
              <AllAppsSupportIcon width="15px" height="15px" />
              <Trans>Support</Trans>
            </DropdownRow>
          </DropdownExternalLink>,
          <DropdownExternalLink
            hasExternalIcon={false}
            onClick={toggleDropdown}
            href="https://kidsfirstdrc.org/contact"
            target="_blank"
          >
            <DropdownRow alignItems="center">
              <AllAppsContactIcon width="16px" height="11px" />
              <Trans>Contact</Trans>
            </DropdownRow>
          </DropdownExternalLink>,
        ]}
        ItemWrapperComponent={props => <Fragment key={props.key} children={props.children} />}
        ContainerComponent={NavbarDropdownWrapper}
        OptionsContainerComponent={NavbarKidsFirstDropdown}
        LabelContainer={MenuLabelContainer}
      >
        <DropdownRow height="55px" alignItems="center">
          <AllAppsMenuIcon width="14" height="14" />
          Resources
        </DropdownRow>
      </Dropdown>
    )}
  />
);
