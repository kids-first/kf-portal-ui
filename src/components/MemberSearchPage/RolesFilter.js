import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import { ROLES } from 'common/constants';
import {
  fetchListOfMembers,
  requestCurrentPageUpdate,
  requestRolesFilterUpdate,
} from 'store/actionCreators/members';

import {
  selectAdminOptionsFilter,
  selectCounts,
  selectCurrentPage,
  selectInterestsFilter,
  selectMembersPerPage,
  selectQueryString,
  selectRolesFilter,
} from '../../store/selectors/members';

import FilterContainer from './FilterContainer';

const getKeyDisplayNames = (originalObjectFromES) =>
  Object.entries(originalObjectFromES).reduce((acc, [keyEs]) => {
    const translation = ROLES.find((r) => r.type === keyEs);
    if (translation) {
      return {
        ...acc,
        [keyEs]: translation.displayName,
      };
    }
    return acc;
  }, []);

class RolesFilter extends Component {
  static propTypes = {
    pending: PropTypes.bool,
    error: PropTypes.object,
    count: PropTypes.object.isRequired,
    queryString: PropTypes.string.isRequired,
    currentPage: PropTypes.number.isRequired,
    membersPerPage: PropTypes.number.isRequired,
    rolesFilter: PropTypes.object.isRequired,
    interestsFilter: PropTypes.object.isRequired,
    fetchListOfMembers: PropTypes.func.isRequired,
    updateRolesFilter: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { updateRolesFilter, rolesFilter } = this.props;
    updateRolesFilter(
      ROLES.reduce(
        (acc, { type }) => ({ ...acc, [type]: rolesFilter[type] ? rolesFilter[type] : false }),
        {},
      ),
    );
  }

  render() {
    const { count, rolesFilter, updateRolesFilter } = this.props;
    return (
      <FilterContainer
        title={'Member Categories'}
        filter={rolesFilter}
        showSearchDefault={false}
        searchString={''}
        showAll={false}
        handleChangeFilterString={{}}
        dataSource={count && count.roles ? count.roles : {}}
        keyDisplayNames={count && count.roles ? getKeyDisplayNames(count.roles) : {}}
        filterBoxName={'roles'}
        updateFilter={updateRolesFilter}
        toggleShowAll={{}}
        {...this.props}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  count: selectCounts(state),
  rolesFilter: selectRolesFilter(state),
  interestsFilter: selectInterestsFilter(state),
  adminOptionsFilter: selectAdminOptionsFilter(state),
  queryString: selectQueryString(state),
  currentPage: selectCurrentPage(state),
  membersPerPage: selectMembersPerPage(state),
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      fetchListOfMembers: fetchListOfMembers,
      updateRolesFilter: (roleFilter) => dispatch(requestRolesFilterUpdate(roleFilter)),
      currentPageUpdate: (currentPage) => dispatch(requestCurrentPageUpdate(currentPage)),
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(RolesFilter);
