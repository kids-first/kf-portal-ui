import React from 'react';
import { Menu } from 'antd';

import AllAppsContactIcon from 'icons/AllAppsContactIcon';
import AllAppsSupportIcon from 'icons/AllAppsSupportIcon';
import AllAppsWebsiteIcon from 'icons/AllAppsWebsiteIcon';
import AllAppsPortalIcon from 'icons/AllAppsPortalIcon';
import AllAppsMenuIcon from 'icons/AllAppsMenuIcon';
import AllAppsStudiesIcon from 'icons/AllAppsStudiesIcon';
import { kfWebRoot } from 'common/injectGlobals';

import HeaderMenu from './HeaderMenu';

export default () => {
  const menuItems = [
    <Menu.Item key="Data Resource Portal">
      <AllAppsPortalIcon width="12px" height="14px" fill="#c03299" />
      Data Resource Portal
    </Menu.Item>,
    <Menu.Item key="Website">
      <a href="https://kidsfirstdrc.org/" target={'_blank'} rel={'noopener noreferrer'}>
        <AllAppsWebsiteIcon size="14px" />
        Website
      </a>
    </Menu.Item>,
    <Menu.Item key="Studies and Access">
      <a
        href={`${kfWebRoot}/support/studies-and-access/`}
        target={'_blank'}
        rel={'noopener noreferrer'}
      >
        <AllAppsStudiesIcon size="15px" />
        Studies and Access
      </a>
    </Menu.Item>,
    <Menu.Item key="Support">
      <a
        href={`${kfWebRoot}/support/getting-started/`}
        target={'_blank'}
        rel={'noopener noreferrer'}
      >
        <AllAppsSupportIcon size="15px" />
        Support
      </a>
    </Menu.Item>,
    <Menu.Item key="Contact">
      <a href={`${kfWebRoot}/contact`} target={'_blank'} rel={'noopener noreferrer'}>
        <AllAppsContactIcon width="16px" height="11px" />
        Contact
      </a>
    </Menu.Item>,
  ];

  return (
    <HeaderMenu menuItems={menuItems}>
      <AllAppsMenuIcon size="14px" />
      Resources
    </HeaderMenu>
  );
};
