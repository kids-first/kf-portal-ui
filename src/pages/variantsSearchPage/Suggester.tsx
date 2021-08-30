import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IFilter, VisualType } from '@ferlab/ui/core/components/filters/types';
import { updateFilters } from '@ferlab/ui/core/data/filters/utils';
import { AutoComplete, Input, notification, Spin } from 'antd';
import debounce from 'lodash/debounce';

import history from 'services/history';
import {
  clearSuggestions,
  fetchSuggestions,
  reInitializeState,
} from 'store/actionCreators/genomicSuggester';
import { DispatchGenomicSuggester } from 'store/genomicSuggesterTypes';
import { SearchText } from 'store/graphql/variants/models';
import { RootState } from 'store/rootState';
import {
  selectError,
  selectIsLoading,
  selectSearchTextSuggestion,
  selectSuggestions,
} from 'store/selectors/genomicSuggester';

import generateSuggestionOptions from './SuggestionOptions';

import style from './Suggester.module.scss';

const WAIT_IN_MS = 100;

const MIN_N_OF_CHARS_BEFORE_SEARCH = 2;

const MAX_N_OF_CHARS = 50;

type SuggesterProps = {
  suggestionType: string;
  placeholderText: string;
  title: string;
};

const mapState = (state: RootState) => ({
  isLoading: selectIsLoading(state),
  suggestions: selectSuggestions(state),
  error: selectError(state),
  suggestionSearchText: selectSearchTextSuggestion(state),
});

const mapDispatch = (dispatch: DispatchGenomicSuggester) => ({
  onFetchSuggestions: (searchText: SearchText, type: string) =>
    dispatch(fetchSuggestions(searchText, type)),
  //TODO clean up redux stuff
  // onSelectSuggestion: (params: SelectedSuggestion) => dispatch(selectChosenSuggestion(params)),
  reInitializeState: () => dispatch(reInitializeState()),
  onClearSuggestions: () => dispatch(clearSuggestions()),
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = SuggesterProps & PropsFromRedux;

const Suggester = (props: Props) => {
  const {
    isLoading,
    error,
    reInitializeState,
    onFetchSuggestions,
    suggestions,
    onClearSuggestions,
    suggestionSearchText,
    suggestionType,
    placeholderText,
  } = props;

  const handleSearch = (userRawInput: string) => {
    onClearSuggestions();
    if (userRawInput && userRawInput.length >= MIN_N_OF_CHARS_BEFORE_SEARCH) {
      return onFetchSuggestions(encodeURI(userRawInput), suggestionType);
    }
  };

  const onSelectSuggestion = (featureType: string, displayType: string) => {
    let fg;
    if (featureType === 'variant') {
      fg = {
        field: 'locus',
        title: '',
        type: VisualType.Checkbox,
      };
    } else {
      fg = {
        field: 'locus', //TODO pus right parameter
        title: '',
        type: VisualType.Checkbox,
      };
    }
    const f: IFilter[] = [
      {
        data: {
          count: 1,
          key: displayType,
        },
        name: '',
        id: displayType,
      },
    ];
    updateFilters(history, fg, f);
  };

  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Error',
        description: 'An error occurred while fetching suggestions',
        duration: null,
        onClose: () => reInitializeState(),
      });
    }
  }, [error, reInitializeState]);

  return (
    <AutoComplete
      className={style.inputVariant}
      style={{ width: style.autoCompleteWidth }}
      onSearch={debounce(handleSearch, WAIT_IN_MS)}
      options={generateSuggestionOptions(suggestionSearchText, suggestions)}
      notFoundContent={isLoading ? <Spin /> : 'No results found'}
      filterOption={(inputValue, option) =>
        //  make sure we show suggestions for corresponding search only.
        (inputValue || '').trim() === option?.meta?.searchText
      }
      onSelect={(value, option) => {
        onClearSuggestions();
        onSelectSuggestion(option.meta.featureType, option.meta.displayName);
      }}
      disabled={!!error}
    >
      <Input
        maxLength={MAX_N_OF_CHARS}
        allowClear
        size="large"
        placeholder={placeholderText}
        onPressEnter={(e: any) => {
          e.preventDefault();
          const value = e.target.value;
          if (!value || !value.trim()) {
            reInitializeState();
          }
        }}
      />
    </AutoComplete>
  );
};

export default connector(Suggester);
