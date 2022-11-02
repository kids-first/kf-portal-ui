import { Button, Input, Select, Space, Tag, Typography } from 'antd';
import ProLabel from '@ferlab/ui/core/components/ProLabel';
import { CaretDownFilled, CaretUpFilled } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import intl from 'react-intl-universal';

import styles from './index.module.scss';
import {
  memberRolesOptions,
  diseasesInterestOptions,
  studiesInterestOptions,
} from 'views/Community/contants';
import { debounce } from 'lodash';

interface OwnProps {
  onSearchFilterChange: (value: string) => void;
  onRoleFilterChange: (value: string[]) => void;
  onDiseasesInterestFilterChange: (value: string[]) => void;
  onStudiesInterestFilterChange: (value: string[]) => void;
  hasFilters: boolean;
}

const FiltersBox = ({
  onSearchFilterChange,
  onRoleFilterChange,
  onDiseasesInterestFilterChange,
  onStudiesInterestFilterChange,
  hasFilters = false,
}: OwnProps) => {
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string[]>([]);
  const [diseasesInterestFilter, setDiseasesInterestFilter] = useState<string[]>([]);
  const [studiesInterestFilter, setStudiesInterestFilter] = useState<string[]>([]);

  const onSearchDebouncedFilerChanged = debounce((value) => onSearchFilterChange(value), 300);

  useEffect(() => onRoleFilterChange(roleFilter), [roleFilter, onRoleFilterChange]);

  useEffect(
    () => onDiseasesInterestFilterChange(diseasesInterestFilter),
    [diseasesInterestFilter, onDiseasesInterestFilterChange],
  );

  useEffect(
    () => onStudiesInterestFilterChange(studiesInterestFilter),
    [studiesInterestFilter, onStudiesInterestFilterChange],
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
              options={memberRolesOptions.map((option) => ({
                label: option.value,
                value: option.value.toLocaleLowerCase(),
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
            <ProLabel title={intl.get('screen.community.search.diseasesInterest')} />
            <Select
              className={styles.filterMultiSelect}
              mode="multiple"
              allowClear
              placeholder={intl.get('screen.community.search.selectPlaceholder')}
              maxTagCount={1}
              value={diseasesInterestFilter}
              onSelect={(value: string) =>
                setDiseasesInterestFilter([...diseasesInterestFilter, value])
              }
              onDeselect={(value: string) =>
                setDiseasesInterestFilter(diseasesInterestFilter.filter((val) => val !== value))
              }
              options={diseasesInterestOptions.map((option) => ({
                label: option.value,
                value: option.value.toLocaleLowerCase(),
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
            <ProLabel title={intl.get('screen.community.search.studiesInterest')} />
            <Select
              className={styles.filterMultiSelect}
              mode="multiple"
              allowClear
              placeholder={intl.get('screen.community.search.selectPlaceholder')}
              maxTagCount={1}
              value={studiesInterestFilter}
              onSelect={(value: string) =>
                setStudiesInterestFilter([...diseasesInterestFilter, value])
              }
              onDeselect={(value: string) =>
                setStudiesInterestFilter(diseasesInterestFilter.filter((val) => val !== value))
              }
              options={studiesInterestOptions.map((option) => ({
                label: option.value,
                value: option.value.toLocaleLowerCase(),
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
              setDiseasesInterestFilter([]);
              setStudiesInterestFilter([]);
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
