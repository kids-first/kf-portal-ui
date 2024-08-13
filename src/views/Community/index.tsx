import { useState } from 'react';
import intl from 'react-intl-universal';
import { SortItems } from '@ferlab/ui/core/components/FilterBox/Sorter';
import CommunityMembersPage from '@ferlab/ui/core/pages/CommunityPage';
import MemberCard from 'views/Community/components/MemberCard';
import { AREA_OF_INTEREST_OPTIONS, ROLE_OPTIONS } from 'views/Community/constants';

import { MAIN_SCROLL_WRAPPER_ID } from 'common/constants';
import { ISearchParams } from 'services/api/user';
import { useCommunityUsers } from 'store/community';
import { scrollToTop } from 'utils/helper';

const DEFAULT_PAGE_SIZE = 25;
const DEFAULT_SEARCH_PARAMS = {
  pageIndex: 0,
  pageSize: DEFAULT_PAGE_SIZE,
  sort: SortItems[0].sort,
  match: '',
};

const CommunityPage = () => {
  const [activeFilter, setActiveFilter] = useState<ISearchParams>(DEFAULT_SEARCH_PARAMS);
  const { users, loading, total } = useCommunityUsers(activeFilter);

  return (
    <CommunityMembersPage
      options={{
        roles: ROLE_OPTIONS,
        interests: AREA_OF_INTEREST_OPTIONS,
      }}
      handleActiveFilter={(searchParams: ISearchParams) => {
        setActiveFilter({
          pageIndex: searchParams.pageIndex,
          pageSize: DEFAULT_PAGE_SIZE,
          sort: searchParams.sort ?? DEFAULT_SEARCH_PARAMS.sort,
          roles: searchParams.roles ?? undefined,
          interests: searchParams.interests ?? undefined,
          match: searchParams.match,
        });
      }}
      dictionary={{
        title: intl.get('screen.community.search.barPlaceholder'),
        result: intl.get('screen.community.resultMember'),
        results: intl.get('screen.community.resultsMember'),
        noResults: intl.get('screen.community.noResults'),
        totalMembers: (members: number) => intl.get('screen.community.totalMembers', { members }),
        filterBox: {
          barPlaceholder: intl.get('screen.community.search.barPlaceholder'),
          filter: intl.get('screen.community.search.filters'),
          role: intl.get('screen.community.search.role'),
          select: {
            placeholder: intl.get('screen.community.search.selectPlaceholder'),
            other: intl.get('global.other'),
          },
          interest: intl.get('screen.community.search.interests'),
          clearFilters: intl.get('screen.community.search.clearFilters'),
          sorter: {
            newest: intl.get('screen.community.search.sorter.newest'),
            oldest: intl.get('screen.community.search.sorter.oldest'),
            lastnameAlpha: intl.get('screen.community.search.sorter.lastnameAlpha'),
          },
        },
      }}
      activeFilter={activeFilter}
      pageSize={DEFAULT_PAGE_SIZE}
      users={users}
      totalPage={total}
      loading={loading}
      handlePageChange={(page) => {
        setActiveFilter({
          ...activeFilter,
          pageIndex: page - 1,
        });
        scrollToTop(MAIN_SCROLL_WRAPPER_ID);
      }}
      renderMember={(activeFilter, item) => (
        <MemberCard match={activeFilter.match || ''} user={item} />
      )}
    />
  );
};

export default CommunityPage;
