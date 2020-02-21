import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import fetchListOfMembersAction from 'components/MemberSearchPage/fetchListOfMembers';
import {
  requestCurrentPageUpdate,
  requestRolesFilterUpdate,
} from 'components/MemberSearchPage/actions';
import { ROLES } from 'common/constants';
import PropTypes from 'prop-types';
import FilterContainer from './FilterContainer';

const getKeyDisplayNames = originalObjectFromES => {
  return Object.entries(originalObjectFromES).reduce((acc, [keyEs]) => {
    const translation = ROLES.find(r => r.type === keyEs);
    if (translation) {
      return {
        ...acc,
        [keyEs]: translation.displayName,
      };
    }
    return acc;
  }, []);
};

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
    const { updateRolesFilter } = this.props;
    updateRolesFilter(ROLES.reduce((acc, { type }) => ({ ...acc, [type]: false }), {}));
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

const mapStateToProps = state => ({
  count: state.ui.memberSearchPageReducer.count,
  rolesFilter: state.ui.memberSearchPageReducer.rolesFilter,
  interestsFilter: state.ui.memberSearchPageReducer.interestsFilter,
  adminOptionsFilter: state.ui.memberSearchPageReducer.adminOptionsFilter,
  queryString: state.ui.memberSearchPageReducer.queryString,
  currentPage: state.ui.memberSearchPageReducer.currentPage,
  membersPerPage: state.ui.memberSearchPageReducer.membersPerPage,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchListOfMembers: fetchListOfMembersAction,
      updateRolesFilter: roleFilter => dispatch(requestRolesFilterUpdate(roleFilter)),
      currentPageUpdate: currentPage => dispatch(requestCurrentPageUpdate(currentPage)),
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(RolesFilter);
