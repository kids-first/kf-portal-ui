import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import fetchListOfMembersAction from 'components/MemberSearchPage/fetchListOfMembers';
import { requestInterestsFilterUpdate } from 'components/MemberSearchPage/actions';
import FilterTable from 'components/MemberSearchPage/FilterTable';
import FilterTableList from 'components/MemberSearchPage/FilterTableList';
import { getCurrentEnd, getCurrentStart, getSelectedFilter } from './utils';

class InterestsFilter extends Component {
  state = {
    showAll: false,
    filterSearchString: '',
  };

  onChange = type => e => {
    this.props.fetchListOfMembers(this.props.queryString, {
      start: getCurrentStart(this.props.currentPage, this.props.membersPerPage),
      end: getCurrentEnd(this.props.currentPage, this.props.membersPerPage),
      roles: getSelectedFilter(this.props.rolesFilter),
      interests: getSelectedFilter({ ...this.props.interestsFilter, [type]: e.target.checked }),
    });

    this.props.updateInterestsFilter({ ...this.props.interestsFilter, [type]: e.target.checked });
  };

  handleClear = event => {
    event.stopPropagation();
    this.props.fetchListOfMembers(this.props.queryString, {
      start: getCurrentStart(this.props.currentPage, this.props.membersPerPage),
      end: getCurrentEnd(this.props.currentPage, this.props.membersPerPage),
      roles: getSelectedFilter(this.props.rolesFilter),
      interests: [],
    });

    this.props.updateInterestsFilter();
  };

  render() {
    return (
      <div>
        <FilterTable
          title={'Research Interests'}
          handleClear={this.handleClear} //FIXME
          collapsed={this.props.collapsed} //FIXME
          borderLeftColor={'#00afed'}
          showSearchDefault={true}
          handleChangeFilterString={e => this.setState({ filterSearchString: e.target.value })}
        >
          <FilterTableList
            dataSource={this.props.count ? this.props.count.interests : {}}
            checkboxes={this.props.interestsFilter}
            onChange={this.onChange}
            keyDisplayNames={{}}
            searchString={this.state.filterSearchString}
            showAll={this.state.showAll}
            toggleShowAll={() => this.setState({ showAll: !this.state.showAll })}
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
      updateInterestsFilter: interestsFilter =>
        dispatch(requestInterestsFilterUpdate(interestsFilter)),
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InterestsFilter);
