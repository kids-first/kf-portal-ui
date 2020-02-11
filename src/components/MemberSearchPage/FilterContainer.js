import React from 'react';
import FilterTable from 'components/MemberSearchPage/FilterTable';
import FilterTableList from 'components/MemberSearchPage/FilterTableList';
import { getCurrentEnd, getCurrentStart, getSelectedFilter } from './utils';
import { ROLES } from 'common/constants';

const roleLookup = ROLES.reduce((acc, { type }) => ({ ...acc, [type]: false }), {});

const Filter = ({
  title,
  membersPerPage,
  rolesFilter,
  interestsFilter,
  adminOptionsFilter,
  filter,
  collapsed,
  showSearchDefault,
  handleChangeFilterString,
  searchString,
  dataSource,
  keyDisplayNames,
  filterBoxName,
  updateFilter,
  currentPageUpdate,
  fetchListOfMembers,
  queryString,
  showAll,
  toggleShowAll,
}) => {
  const fetchParam = {
    start: getCurrentStart(1, membersPerPage),
    end: getCurrentEnd(1, membersPerPage),
    roles: getSelectedFilter(rolesFilter),
    interests: getSelectedFilter(interestsFilter),
    adminMemberOptions: getSelectedFilter(adminOptionsFilter),
  };

  const onChange = type => e => {
    e.preventDefault();

    fetchListOfMembers(queryString, {
      ...fetchParam,
      [filterBoxName]: getSelectedFilter({ ...filter, [type]: e.target.checked }),
    });

    currentPageUpdate(1);
    updateFilter({ ...filter, [type]: e.target.checked });
  };

  const handleClear = event => {
    event.stopPropagation();

    fetchListOfMembers(queryString, {
      ...fetchParam,
      [filterBoxName]: [],
    });

    currentPageUpdate(1);
    filterBoxName === 'roles' ? updateFilter(roleLookup) : updateFilter();
  };

  return (
    <FilterTable
      title={title}
      handleClear={handleClear}
      collapsed={collapsed}
      showSearchDefault={showSearchDefault}
      searchString={searchString}
      showAll={showAll}
      toggleShowAll={toggleShowAll}
      handleChangeFilterString={handleChangeFilterString}
      showClear={getSelectedFilter(filter).length > 0}
    >
      <FilterTableList
        dataSource={dataSource}
        checkboxes={filter}
        onChange={onChange}
        keyDisplayNames={keyDisplayNames}
      />
    </FilterTable>
  );
};

export default Filter;
