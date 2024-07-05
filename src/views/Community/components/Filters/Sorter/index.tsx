import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Space } from 'antd';
import { useState } from 'react';
import intl from 'react-intl-universal';

import styles from './index.module.css';

export const SortItems = [
  {
    label: intl.get('screen.community.search.sorter.newest'),
    sort: 'creation_date:desc',
  },
  {
    label: intl.get('screen.community.search.sorter.oldest'),
    sort: 'creation_date:asc',
  },
  {
    label: intl.get('screen.community.search.sorter.lastnameAlpha'),
    sort: 'last_name:asc',
  },
];

interface OwnProps {
  onSortChange: (value: string) => void;
}

const Sorter = ({ onSortChange }: OwnProps) => {
  const [selectedSortIndex, setSelectedSortIndex] = useState(0);

  return (
    <Dropdown
      overlay={
        <Menu
          selectedKeys={[selectedSortIndex.toString()]}
          items={SortItems.map((item, index) => ({
            label: item.label,
            key: index,
            onClick: () => {
              setSelectedSortIndex(index);
              onSortChange(item.sort);
            },
          }))}
        />
      }
    >
      <a onClick={(e) => e.preventDefault()}>
        <Space className={styles.sortTrigger}>
          {SortItems[selectedSortIndex].label}
          <DownOutlined />
        </Space>
      </a>
    </Dropdown>
  );
};

export default Sorter;
