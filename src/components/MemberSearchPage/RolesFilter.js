import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import fetchListOfMembersAction from 'components/MemberSearchPage/fetchListOfMembers';
import { requestRolesFilterUpdate } from 'components/MemberSearchPage/actions';
import { ROLES } from 'common/constants';
import FilterTable from 'components/MemberSearchPage/FilterTable';
import FilterTableList from 'components/MemberSearchPage/FilterTableList';
import { getSelectedFilter, getCurrentStart, getCurrentEnd } from './utils';
import PropTypes from 'prop-types';

const roleLookup = ROLES.reduce((acc, { type }) => ({ ...acc, [type]: false }), {});

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
  state = {
    showAll: false,
    filterSearchString: '',
  };

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

  onChange = type => e => {
    const { queryString, membersPerPage, currentPage, rolesFilter, interestsFilter, updateRolesFilter, fetchListOfMembers } = this.props;

    fetchListOfMembers(queryString, {
      start: getCurrentStart(currentPage, membersPerPage),
      end: getCurrentEnd(currentPage, membersPerPage),
      roles: getSelectedFilter({ ...rolesFilter, [type]: e.target.checked }),
      interests: getSelectedFilter(interestsFilter),
    });

    updateRolesFilter({ ...rolesFilter, [type]: e.target.checked });
  };

  handleClear = event => {
    event.stopPropagation();
    const { queryString, membersPerPage, currentPage, updateRolesFilter, fetchListOfMembers, interestsFilter } = this.props;

    fetchListOfMembers(queryString, {
      start: getCurrentStart(currentPage, membersPerPage),
      end: getCurrentEnd(currentPage, membersPerPage),
      roles: [],
      interests: getSelectedFilter(interestsFilter),
    });

    updateRolesFilter(roleLookup);
  };

  handleChangeFilterString = event => {
    this.setState({ filterSearchString: event.target.value });
  };

  toggleShowAll = () => {
    const {showAll} = this.state;
    this.setState({ showAll: !showAll });
  };

  render() {
    const { showAll, filterSearchString } = this.state;
    const { count, rolesFilter, collapsed } = this.props;
    return (
      <div>
        <FilterTable
          title={'Member Categories'}
          handleClear={this.handleClear}
          collapsed={collapsed}
          borderLeftColor={'#a42c90'}
          showSearchDefault={false}
          searchString={filterSearchString}
          showAll={showAll}
          toggleShowAll={this.toggleShowAll}
          handleChangeFilterString={this.handleChangeFilterString}
          showClear={getSelectedFilter(rolesFilter).length > 0}
        >
          <FilterTableList
            dataSource={count && count.roles ? count.roles : {}}
            checkboxes={rolesFilter}
            onChange={this.onChange}
            keyDisplayNames={
              count && count.roles
                ? getKeyDisplayNames(count.roles)
                : {}
            }
          />
        </FilterTable>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  count: state.ui.memberSearchPageReducer.count,
  rolesFilter: state.ui.memberSearchPageReducer.rolesFilter,
  interestsFilter: state.ui.memberSearchPageReducer.interestsFilter,
  queryString: state.ui.memberSearchPageReducer.queryString,
  currentPage: state.ui.memberSearchPageReducer.currentPage,
  membersPerPage: state.ui.memberSearchPageReducer.membersPerPage,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchListOfMembers: fetchListOfMembersAction,
      updateRolesFilter: roleFilter => dispatch(requestRolesFilterUpdate(roleFilter)),
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RolesFilter);
