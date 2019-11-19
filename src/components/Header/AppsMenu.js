import React, { Fragment } from 'react';
import Dropdown from 'uikit/Dropdown';
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
            style={{ borderLeftColor: '#c03299' }}
          >
            <DropdownRow color="#c03299">
              <AllAppsPortalIcon width="12px" height="14px" fill="#c03299" />
              Data Resource Portal
            </DropdownRow>
          </DropdownExternalLink>,
          <DropdownExternalLink
            hasExternalIcon={false}
            onClick={toggleDropdown}
            href="https://kidsfirstdrc.org/"
            target="_blank"
          >
            <DropdownRow>
              <AllAppsWebsiteIcon width="14px" height="13px" />
              Website
            </DropdownRow>
          </DropdownExternalLink>,
          <DropdownExternalLink
            hasExternalIcon={false}
            onClick={toggleDropdown}
            href="https://kidsfirstdrc.org/support/studies-and-access/"
            target="_blank"
          >
            <DropdownRow>
              <AllAppsStudiesIcon width="15" height="15" />
              Studies and Access
            </DropdownRow>
          </DropdownExternalLink>,
          <DropdownExternalLink
            hasExternalIcon={false}
            onClick={toggleDropdown}
            href="https://kidsfirstdrc.org/support/getting-started/"
            target="_blank"
          >
            <DropdownRow>
              <AllAppsSupportIcon width="15px" height="15px" />
              Support
            </DropdownRow>
          </DropdownExternalLink>,
          <DropdownExternalLink
            hasExternalIcon={false}
            onClick={toggleDropdown}
            href="https://kidsfirstdrc.org/contact"
            target="_blank"
          >
            <DropdownRow>
              <AllAppsContactIcon width="16px" height="11px" />
              Contact
            </DropdownRow>
          </DropdownExternalLink>,
        ]}
        ItemWrapperComponent={props => <Fragment key={'ItemWrapper'} children={props.children} />}
        ContainerComponent={NavbarDropdownWrapper}
        OptionsContainerComponent={NavbarKidsFirstDropdown}
        LabelContainer={MenuLabelContainer}
      >
        <DropdownRow>
          <AllAppsMenuIcon size="14px" />
          Resources
        </DropdownRow>
      </Dropdown>
    )}
  />
);
