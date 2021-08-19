import React, { useEffect, useRef, useState } from 'react';
import {
  InfoCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { ISqonGroupFilter } from '@ferlab/ui/core/components/QueryBuilder/types';
import ScrollView from '@ferlab/ui/core/layout/ScrollView';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { Input, Menu } from 'antd';

import DiseaseIcon from 'icons/DiseaseIcon';
import FrequencyIcon from 'icons/FrequencyIcon';
import GeneIcon from 'icons/GeneIcon';
import OccurenceIcon from 'icons/OccurenceIcon';
import SearchIcon from 'icons/SearchIcon';
import VariantIcon2 from 'icons/VariantIcon2';

import FrequencyFilters from './filters/FrequencyFilters';
import GeneFilters from './filters/GeneFilters';
import OccurenceFilters from './filters/OccurenceFilters';
import PathogenicityFilters from './filters/PathogenicityFilters';
import VariantFilters from './filters/VariantFilters';
import SidebarRightPanel from './SidebarRightPanel';

import styles from './Sidebar.module.scss';

type VariantsProps = {
  filters: ISqonGroupFilter | Record<any, any>;
  // Maybe add search result like in studies.tsx
};

type OwnProps = VariantsProps;

const menuFilters = [
  {
    key: '1',
    title: 'Variant',
    icon: VariantIcon2,
    filters: VariantFilters,
  },
  {
    key: '2',
    title: 'Gene',
    icon: GeneIcon,
    filters: GeneFilters,
  },
  {
    key: '3',
    title: 'Pathogenicity',
    icon: DiseaseIcon,
    filters: PathogenicityFilters,
  },
  {
    key: '4',
    title: 'Frequency',
    icon: FrequencyIcon,
    filters: FrequencyFilters,
  },
  {
    key: '5',
    title: 'Occurence',
    icon: OccurenceIcon,
    filters: OccurenceFilters,
  },
];

const VariantFiltersSider = (/*props: OwnProps*/) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [selectedKey, setSelectedKey] = useState<string>('');
  const searchInputRed = useRef<Input>(null);
  const selectedFilterComponent = menuFilters.filter(
    (menuFilter) => menuFilter.key == selectedKey,
  )[0];

  useEffect(() => {
    if (!collapsed && selectedKey == 'search') {
      searchInputRed.current?.focus();
    }
  }, [collapsed, selectedKey]);

  return (
    <div className={styles.siderContainer}>
      <div className={styles.sider} data-collapsed={collapsed}>
        <StackLayout vertical center={false} flexContent>
          <div className={styles.sidebarToggleIconContainer}>
            {collapsed ? (
              <MenuUnfoldOutlined
                className={styles.sidebarToggleIcon}
                onClick={() => setCollapsed(false)}
              />
            ) : (
              <MenuFoldOutlined
                className={styles.sidebarToggleIcon}
                onClick={() => {
                  setCollapsed(true);
                  setSelectedKey('');
                }}
              />
            )}
          </div>
          <ScrollView>
            <Menu
              className={styles.sidebarMenu}
              onSelect={(item) => {
                setSelectedKey(item.key.toString());
                if (item.key.toString() == 'search') {
                  setCollapsed(false);
                }
              }}
              selectedKeys={[selectedKey]}
            >
              {collapsed ? (
                <Menu.Item key="search" icon={<SearchIcon />}></Menu.Item>
              ) : (
                <div className={styles.searchMenuItem}>
                  <Input
                    ref={searchInputRed}
                    placeholder="Quick filter..."
                    prefix={<SearchOutlined />}
                    suffix={<InfoCircleOutlined></InfoCircleOutlined>}
                  />
                </div>
              )}
              {menuFilters.map((menuFilter) => (
                <Menu.Item key={menuFilter.key} icon={<menuFilter.icon />}>
                  {menuFilter.title}
                </Menu.Item>
              ))}
            </Menu>
          </ScrollView>
        </StackLayout>
      </div>
      <SidebarRightPanel
        isOpen={selectedKey.length > 0 && selectedKey != 'search'}
        onClose={() => {
          setSelectedKey('');
        }}
      >
        {selectedFilterComponent && (
          <selectedFilterComponent.filters></selectedFilterComponent.filters>
        )}
      </SidebarRightPanel>
    </div>
  );
};

export default VariantFiltersSider;
