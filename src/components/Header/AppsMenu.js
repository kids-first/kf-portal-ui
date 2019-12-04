import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';

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
      <Link to="https://kidsfirstdrc.org/" target="_blank">
        <AllAppsWebsiteIcon size="14px" />
        Website
      </Link>
    </Menu.Item>,

    <Menu.Item key="Studies and Access">
      <Link to={`${kfWebRoot}/support/studies-and-access/`} target="_blank">
        <AllAppsStudiesIcon size="15px" />
        Studies and Access
      </Link>
    </Menu.Item>,

    <Menu.Item key="Support">
      <Link to={`${kfWebRoot}/support/getting-started/`} target="_blank">
        <AllAppsSupportIcon size="15px" />
        Support
      </Link>
    </Menu.Item>,

    <Menu.Item key="Contact">
      <Link to={`${kfWebRoot}/contact`} target="_blank">
        <AllAppsContactIcon width="16px" height="11px" />
        Contact
      </Link>
    </Menu.Item>,
  ];

  return (
    <HeaderMenu menuItems={menuItems}>
      <AllAppsMenuIcon size="14px" />
      Resources
    </HeaderMenu>
  );
};
