import { Button, Input, Select, Space, Tag, Typography } from 'antd';
import ProLabel from '@ferlab/ui/core/components/ProLabel';
import { CaretDownFilled, CaretUpFilled } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import intl from 'react-intl-universal';

import styles from './index.module.scss';
import { memberRolesOptions, areaOfInterestOptions } from 'views/Community/contants';
import { debounce } from 'lodash';

interface OwnProps {
  onSearchFilterChange: (value: string) => void;
  onRoleFilterChange: (value: string[]) => void;
  onInterestsFilterChange: (value: string[]) => void;
  hasFilters: boolean;
}

const FiltersBox = ({
  onSearchFilterChange,
  onRoleFilterChange,
  onInterestsFilterChange,
  hasFilters = false,
}: OwnProps) => {
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string[]>([]);
  const [interestsFilter, setInterestsFilter] = useState<string[]>([]);

  const onSearchDebouncedFilerChanged = debounce((value) => onSearchFilterChange(value), 300);

  useEffect(() => onRoleFilterChange(roleFilter), [roleFilter, onRoleFilterChange]);

  useEffect(
    () => onInterestsFilterChange(interestsFilter),
    [interestsFilter, onInterestsFilterChange],
  );

  return (
    <Space direction="vertical" size={16} className={styles.filtersContainer}>
      <Space direction="vertical" className={styles.searchBarContainer}>
        <ProLabel title={intl.get('screen.community.search.barPlaceholder')} />
        <div className={styles.filterContentWrapper}>
          <Input
            onChange={(e) => onSearchDebouncedFilerChanged(e.currentTarget.value)}
            placeholder="e.g. Watson, Children's Hospital of Philadelphia"
          />
          <Button onClick={() => setFiltersVisible(!filtersVisible)}>
            {intl.get('screen.community.search.filters')}{' '}
            {filtersVisible ? <CaretUpFilled /> : <CaretDownFilled />}
          </Button>
        </div>
      </Space>
      {filtersVisible && (
        <Space className={styles.searchBarContainer} size={16} align="end">
          <Space direction="vertical">
            <ProLabel title={intl.get('screen.community.search.role')} />
            <Select
              className={styles.filterMultiSelect}
              mode="multiple"
              allowClear
              placeholder={intl.get('screen.community.search.selectPlaceholder')}
              maxTagCount="responsive"
              value={roleFilter}
              onSelect={(value: string) => setRoleFilter([...roleFilter, value])}
              onDeselect={(value: string) =>
                setRoleFilter((prevRoleFilter) => prevRoleFilter.filter((val) => val !== value))
              }
              options={memberRolesOptions.map((option) => ({
                label: option.value,
                value: option.key,
              }))}
              tagRender={({ onClose, label }) => (
                <Tag
                  className={styles.filterTag}
                  closable
                  onClose={onClose}
                  style={{ marginRight: 3 }}
                >
                  <Typography.Text className={styles.filterTagText}>{label}</Typography.Text>
                </Tag>
              )}
            />
          </Space>
          <Space direction="vertical">
            <ProLabel title={intl.get('screen.community.search.interests')} />
            <Select
              className={styles.filterMultiSelect}
              mode="multiple"
              allowClear
              placeholder={intl.get('screen.community.search.selectPlaceholder')}
              maxTagCount="responsive"
              value={interestsFilter}
              onSelect={(value: string) => setInterestsFilter([...interestsFilter, value])}
              onDeselect={(value: string) =>
                setInterestsFilter((previousInterestsFilter) =>
                  previousInterestsFilter.filter((val) => val !== value),
                )
              }
              options={areaOfInterestOptions.map((option) => ({
                label: option,
                value: option.toLocaleLowerCase(),
              }))}
              tagRender={({ onClose, label }) => (
                <Tag
                  className={styles.filterTag}
                  closable
                  onClose={onClose}
                  style={{ marginRight: 3 }}
                >
                  <Typography.Text className={styles.filterTagText}>{label}</Typography.Text>
                </Tag>
              )}
            />
          </Space>

          <Button
            disabled={!hasFilters}
            onClick={() => {
              setRoleFilter([]);
              setInterestsFilter([]);
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
