import { useState } from 'react';
import intl from 'react-intl-universal';
import TableHeader from '@ferlab/ui/core/components/ProTable/Header';
import { BooleanOperators, TermOperators } from '@ferlab/ui/core/data/sqon/operators';
import { generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { List, Space, Typography } from 'antd';
import { useMembers } from 'graphql/members/actions';

import { MAIN_SCROLL_WRAPPER_ID } from 'common/constants';
import { scrollToTop } from 'utils/helper';

import FiltersBox from './components/Filters/Box';
import MemberCard from './components/MemberCard';
import { DEFAULT_QUERY_CONFIG } from './contants';

import styles from './index.module.scss';

const { Title } = Typography;

const resolveSqon = (search: string, roles: string[], interests: string[]) => {
  const content = [];

  if (search.length > 0) {
    content.push(
      generateValueFilter({
        field: 'searchText',
        value: [`${search}*`],
        operator: TermOperators.in,
      }),
    );
  }

  if (roles.length > 0) {
    content.push(
      generateValueFilter({
        field: 'roles',
        value: roles,
        operator: TermOperators.in,
      }),
    );
  }

  if (interests.length) {
    content.push(
      generateValueFilter({
        field: 'searchableInterests.name.raw',
        value: interests,
        operator: TermOperators.in,
      }),
    );
  }

  return {
    content,
    op: BooleanOperators.and,
  };
};

const CommunityPage = () => {
  const [search, setSearch] = useState('');
  const [queryConfig, setQueryConfig] = useState(DEFAULT_QUERY_CONFIG);
  const [roleFilter, setRoleFilter] = useState<string[]>([]);
  const [interestsFilter, setInterestsFilter] = useState<string[]>([]);
  const { loading, data, total } = useMembers({
    first: queryConfig.size,
    offset: queryConfig.size * (queryConfig.pageIndex - 1),
    sqon: resolveSqon(search, roleFilter, interestsFilter),
  });

  return (
    <Space direction="vertical" size={24} className={styles.communityWrapper}>
      <Title className={styles.title} level={4}>
        {intl.get('screen.community.title')}
      </Title>
      <FiltersBox
        onSearchFilterChange={setSearch}
        onRoleFilterChange={setRoleFilter}
        onInterestsFilterChange={setInterestsFilter}
        hasFilters={roleFilter.length > 0 || interestsFilter.length > 0}
      />
      <Space className={styles.usersListWrapper} size={24} direction="vertical">
        <TableHeader
          pageIndex={queryConfig.pageIndex}
          pageSize={queryConfig.size}
          total={total}
          dictionary={{
            itemCount: {
              results: 'Members',
              noResults: 'No members',
              clear: '',
              of: '',
              selectAllResults: '',
              selected: '',
              selectedPlural: '',
            },
          }}
        ></TableHeader>
        <List
          grid={{
            gutter: 24,
            xs: 1,
            sm: 2,
            md: 2,
            lg: 3,
            xl: 4,
            xxl: 5,
          }}
          dataSource={data}
          className={styles.membersList}
          pagination={{
            total: total,
            pageSize: queryConfig.size,
            onChange: (page) => {
              setQueryConfig({
                ...queryConfig,
                pageIndex: page,
              });
              scrollToTop(MAIN_SCROLL_WRAPPER_ID);
            },
            size: 'small',
            hideOnSinglePage: true,
            showSizeChanger: false,
          }}
          loading={loading}
          renderItem={(item) => (
            <List.Item className={styles.memberListItem}>
              <MemberCard user={item} match={search} />
            </List.Item>
          )}
        />
      </Space>
    </Space>
  );
};

export default CommunityPage;
