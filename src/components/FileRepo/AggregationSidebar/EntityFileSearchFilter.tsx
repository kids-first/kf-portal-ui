/* eslint-disable react/prop-types */
import {
  DispatchFileSearchFilters,
  EntityName,
  ERROR_MSG_ID_NOT_FOUND,
  FileSearchFilterSubState,
  SearchConfig,
} from 'store/fileSearchFiltersTypes';
import { setSqonArrangerCB } from 'store/sqon';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from 'store/rootState';
import {
  selectFileSearchFilterError,
  selectIsFileSearchFilterLoading,
} from 'store/selectors/fileSearchFilters';
import { reInitializeFilterState, searchById } from 'store/actionCreators/fileSearchFilters';
import React, { FunctionComponent } from 'react';
import { Input, Form, Button } from 'antd';
import './aggregationSideBar.css';
import capitalize from 'lodash/capitalize';

const { Search } = Input;

type OwnProps = {
  entityName: EntityName;
  setSqon: setSqonArrangerCB;
  placeholder: string;
};

const mapState = (state: RootState, ownProps: OwnProps): FileSearchFilterSubState => ({
  isLoading: selectIsFileSearchFilterLoading(state, ownProps.entityName),
  error: selectFileSearchFilterError(state, ownProps.entityName),
});

const mapDispatch = (dispatch: DispatchFileSearchFilters) => ({
  onSearchById: (params: SearchConfig) => dispatch(searchById(params)),
  reInitializeState: (entityName: EntityName) => dispatch(reInitializeFilterState(entityName)),
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & OwnProps;

const MIN_N_OF_CHARACTERS_BEFORE_SEARCH = 3;

const canLaunchSearch = (input: string | null) =>
  input && input.length >= MIN_N_OF_CHARACTERS_BEFORE_SEARCH;

const displayErrorMessage = (entityName: EntityName, error?: Error | null) => {
  if (!error) {
    return undefined;
  } else if (error.message === ERROR_MSG_ID_NOT_FOUND) {
    const lowerCaseEntityName = EntityName[entityName].toLowerCase();
    const entityPrefix = capitalize(lowerCaseEntityName);
    return `${entityPrefix} ${ERROR_MSG_ID_NOT_FOUND}`;
  }
  return 'an error occurred';
};

const EntityFileSearchFilter: FunctionComponent<Props> = (props) => {
  const {
    isLoading,
    error,
    reInitializeState,
    onSearchById,
    entityName,
    setSqon,
    placeholder,
  } = props;

  return (
    <Form name={`form_${entityName}`}>
      <Form.Item
        noStyle={!error}
        validateStatus={error ? 'error' : undefined}
        help={displayErrorMessage(entityName, error)}
      >
        <Search
          size={'small'}
          allowClear
          disabled={!!error}
          placeholder={placeholder}
          loading={isLoading}
          onSearch={(userInputId) => {
            if (canLaunchSearch(userInputId)) {
              onSearchById({ entityName, id: userInputId, setArrangerSqonCB: setSqon });
            }
          }}
        />
      </Form.Item>
      {error && (
        <div className={'filter-reset-btn'}>
          <Button htmlType="button" onClick={() => reInitializeState(entityName)} size={'small'}>
            Reset
          </Button>
        </div>
      )}
    </Form>
  );
};

const Connected = connector(EntityFileSearchFilter);

export default Connected;
