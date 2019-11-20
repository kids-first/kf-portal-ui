import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import fetchListOfMembersAction from 'components/MemberSearchPage/fetchListOfMembers';
import { requestRolesFilterUpdate } from 'components/MemberSearchPage/actions';
import { ROLES } from 'common/constants';
import FilterTable from 'components/MemberSearchPage/FilterTable';
import FilterTableList from 'components/MemberSearchPage/FilterTableList';
import { getSelectedFilter, getCurrentStart, getCurrentEnd } from './utils';

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

  componentDidMount() {
    this.props.updateRolesFilter(ROLES.reduce((acc, { type }) => ({ ...acc, [type]: false }), {}));
  }

  onChange = type => e => {
    this.props.fetchListOfMembers(this.props.queryString, {
      start: getCurrentStart(this.props.currentPage, this.props.membersPerPage),
      end: getCurrentEnd(this.props.currentPage, this.props.membersPerPage),
      roles: getSelectedFilter({ ...this.props.rolesFilter, [type]: e.target.checked }),
      interests: getSelectedFilter(this.props.interestsFilter),
    });

    this.props.updateRolesFilter({ ...this.props.rolesFilter, [type]: e.target.checked });
  };

  handleClear = event => {
    event.stopPropagation();

    this.props.fetchListOfMembers(this.props.queryString, {
      start: getCurrentStart(this.props.currentPage, this.props.membersPerPage),
      end: getCurrentEnd(this.props.currentPage, this.props.membersPerPage),
      roles: [],
      interests: getSelectedFilter(this.props.interestsFilter),
    });

    this.props.updateRolesFilter(roleLookup);
  };

  render() {
    return (
      <div>
        <FilterTable
          title={'Member Categories'}
          handleClear={this.handleClear}
          collapsed={this.props.collapsed}
          borderLeftColor={'#a42c90'}
          showSearchDefault={false}
          searchString={this.state.filterSearchString}
          showAll={this.state.showAll}
          toggleShowAll={() => this.setState({ showAll: !this.state.showAll })}
          handleChangeFilterString={e => this.setState({ filterSearchString: e.target.value })}
        >
          <FilterTableList
            dataSource={this.props.count && this.props.count.roles ? this.props.count.roles : {}}
            checkboxes={this.props.rolesFilter}
            onChange={this.onChange}
            keyDisplayNames={
              this.props.count && this.props.count.roles
                ? getKeyDisplayNames(this.props.count.roles)
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
