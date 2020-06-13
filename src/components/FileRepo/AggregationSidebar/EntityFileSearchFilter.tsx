/* eslint-disable react/prop-types */
import {
  DispatchFileSearchFilters,
  EntityName,
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
import React, { FunctionComponent, useEffect } from 'react';
import { Input, notification } from 'antd';

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

  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Error',
        description: 'An error occurred. No query could be made. Please try again.',
        duration: null,
        onClose: () => reInitializeState(entityName),
      });
    }
  }, [error, reInitializeState, entityName]);

  return (
    <Search
      size={'small'}
      allowClear
      disabled={!!error}
      placeholder={placeholder}
      loading={isLoading}
      enterButton
      onSearch={(userInputId) => {
        if (canLaunchSearch(userInputId)) {
          onSearchById({ entityName, id: userInputId, setArrangerSqonCB: setSqon });
        }
      }}
    />
  );
};

const Connected = connector(EntityFileSearchFilter);

export default Connected;
