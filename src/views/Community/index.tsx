import TableHeader from '@ferlab/ui/core/components/ProTable/Header';
import intl from 'react-intl-universal';
import { Space, Typography, List } from 'antd';
import { MAIN_SCROLL_WRAPPER_ID } from 'common/constants';
import { useEffect, useState } from 'react';
import useDebounce from '@ferlab/ui/core/hooks/useDebounce';
import { scrollToTop } from 'utils/helper';
import FiltersBox from './components/Filters/Box';
import { SortItems } from './components/Filters/Sorter';

import styles from './index.module.scss';
import MemberCard from './components/MemberCard';
import { PersonaApi } from 'services/api/persona';
import { TPersonaUser } from 'services/api/persona/models';

const { Title } = Typography;
const DEFAULT_PAGE_SIZE = 25;

const CommunityPage = () => {
  const [users, setUsers] = useState<TPersonaUser[]>([]);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [match, setMatch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [interestFilter, setInterestFilter] = useState('');
  const [sort, setSort] = useState(SortItems[0].sort);
  const debouncedMatchValue = useDebounce(match, 300);

  useEffect(() => {
    setIsLoading(true);
    PersonaApi.search({
      pageIndex: currentPage,
      pageSize: DEFAULT_PAGE_SIZE,
      match,
      roles: roleFilter,
      interests: interestFilter,
    }).then(({ data }) => {
      console.log('data', data); //TODO: to remove
      setUsers(data?.publicMembers || []);
      setCount(data?.count?.public || 0);
      setIsLoading(false);
    });
  }, [currentPage, sort, debouncedMatchValue, roleFilter, interestFilter]);

  return (
    <Space direction="vertical" size={24} className={styles.communityWrapper}>
      <Title className={styles.title} level={4}>
        {intl.get('screen.community.title')}
      </Title>
      <FiltersBox
        onMatchFilterChange={setMatch}
        onRoleFilterChange={setRoleFilter}
        onInterestFilterChange={setInterestFilter}
        onSortChange={setSort}
        hasFilters={!!(roleFilter || interestFilter)}
      />
      <Space className={styles.usersListWrapper} size={24} direction="vertical">
        <TableHeader
          pageIndex={currentPage + 1}
          pageSize={DEFAULT_PAGE_SIZE}
          total={count}
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
          dataSource={users}
          className={styles.membersList}
          pagination={{
            total: count,
            pageSize: DEFAULT_PAGE_SIZE,
            onChange: (page) => {
              setCurrentPage(page - 1);
              scrollToTop(MAIN_SCROLL_WRAPPER_ID);
            },
            size: 'small',
            hideOnSinglePage: true,
            showSizeChanger: false,
          }}
          loading={isLoading}
          renderItem={(item) => (
            <List.Item className={styles.memberListItem}>
              <MemberCard user={item} match={match} />
            </List.Item>
          )}
        />
      </Space>
    </Space>
  );
};

export default CommunityPage;
