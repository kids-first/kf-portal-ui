import React from 'react';
import { Menu } from 'antd';

import AllAppsContactIcon from 'icons/AllAppsContactIcon';
import AllAppsSupportIcon from 'icons/AllAppsSupportIcon';
import AllAppsWebsiteIcon from 'icons/AllAppsWebsiteIcon';
import AllAppsMenuIcon from 'icons/AllAppsMenuIcon';
import AllAppsStudiesIcon from 'icons/AllAppsStudiesIcon';
import { kfWebRoot, notionWebRoot } from 'common/injectGlobals';

import HeaderMenu from './HeaderMenu';

const AppsMenu = () => {
  const menuItems = [
    <Menu.Item key="Website">
      <a href="https://kidsfirstdrc.org/" target={'_blank'} rel={'noopener noreferrer'}>
        <AllAppsWebsiteIcon size="14px" />
        Website
      </a>
    </Menu.Item>,
    <Menu.Item key="Studies and Access">
      <a
        href={`${notionWebRoot}/Studies-and-Access-a5d2f55a8b40461eac5bf32d9483e90f`}
        target={'_blank'}
        rel={'noopener noreferrer'}
      >
        <AllAppsStudiesIcon size="15px" />
        Studies and Access
      </a>
    </Menu.Item>,
    <Menu.Item key="Support">
      <a
        href={`${notionWebRoot}/Kids-First-DRC-Help-Center-c26b36ff66564417834f3f264475d10a`}
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

export default AppsMenu;
