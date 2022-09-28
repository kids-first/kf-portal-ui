import { Button, Input, Select, Space, Tag, Typography } from 'antd';
import ProLabel from '@ferlab/ui/core/components/ProLabel';
import { CaretDownFilled, CaretUpFilled } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import intl from 'react-intl-universal';

import styles from './index.module.scss';
import Sorter from '../Sorter';
import { roleOptions, interestsOptions } from 'views/Community/contants';

interface OwnProps {
  onMatchFilterChange: (value: string) => void;
  onRoleFilterChange: (value: string) => void;
  onInterestFilterChange: (value: string) => void;
  onSortChange: (value: string) => void;
  hasFilters: boolean;
}

const FiltersBox = ({
  onMatchFilterChange,
  onRoleFilterChange,
  onInterestFilterChange,
  onSortChange,
  hasFilters = false,
}: OwnProps) => {
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string[]>([]);
  const [interestFilter, setInterestFilter] = useState<string[]>([]);

  useEffect(() => onRoleFilterChange(roleFilter.join(',')), [roleFilter]);

  useEffect(() => onInterestFilterChange(interestFilter.join(',')), [interestFilter]);

  return (
    <Space direction="vertical" size={16} className={styles.filtersContainer}>
      <Space direction="vertical" className={styles.searchBarContainer}>
        <ProLabel title={intl.get('screen.community.search.barPlaceholder')} />
        <div className={styles.filterContentWrapper}>
          <Input
            onChange={(e) => onMatchFilterChange(e.currentTarget.value)}
            placeholder="e.g. Watson, Children's Hospital of Philadelphia"
          />
          <Button onClick={() => setFiltersVisible(!filtersVisible)}>
            {intl.get('screen.community.search.filters')}{' '}
            {filtersVisible ? <CaretUpFilled /> : <CaretDownFilled />}
          </Button>
          {/* <Sorter onSortChange={onSortChange} /> */}
        </div>
      </Space>
      {filtersVisible && (
        <Space className={styles.filterContentWrapper} size={16} align="end">
          <Space direction="vertical">
            <ProLabel title={intl.get('screen.community.search.role')} />
            <Select
              className={styles.filterMultiSelect}
              mode="multiple"
              allowClear
              placeholder={intl.get('screen.community.search.selectPlaceholder')}
              maxTagCount={1}
              value={roleFilter}
              onSelect={(value: string) => setRoleFilter([...roleFilter, value])}
              onDeselect={(value: string) =>
                setRoleFilter(roleFilter.filter((val) => val !== value))
              }
              options={roleOptions.map((option) => ({
                label: option,
                value: option,
              }))}
              tagRender={({ onClose, value }) => (
                <Tag
                  className={styles.filterTag}
                  closable
                  onClose={onClose}
                  style={{ marginRight: 3 }}
                >
                  <Typography.Text className={styles.filterTagText}>{value}</Typography.Text>
                </Tag>
              )}
            />
          </Space>
          <Space direction="vertical">
            <ProLabel title={intl.get('screen.community.search.interest')} />
            <Select
              className={styles.filterMultiSelect}
              mode="multiple"
              allowClear
              placeholder={intl.get('screen.community.search.selectPlaceholder')}
              maxTagCount={1}
              value={interestFilter}
              onSelect={(value: string) => setInterestFilter([...interestFilter, value])}
              onDeselect={(value: string) =>
                setInterestFilter(interestFilter.filter((val) => val !== value))
              }
              options={interestsOptions.map((option) => ({
                label: option.value,
                value: option.value,
              }))}
              tagRender={({ onClose, value }) => (
                <Tag
                  className={styles.filterTag}
                  closable
                  onClose={onClose}
                  style={{ marginRight: 3 }}
                >
                  <Typography.Text className={styles.filterTagText}>{value}</Typography.Text>
                </Tag>
              )}
            />
          </Space>
          <Button
            disabled={!hasFilters}
            onClick={() => {
              setRoleFilter([]);
              setInterestFilter([]);
            }}
          >
            {intl.get('screen.community.search.clearFilters')}
          </Button>
        </Space>
      )}
    </Space>
  );
};

export default FiltersBox;
