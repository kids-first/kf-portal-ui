import React, { FunctionComponent, useEffect } from 'react';
import { AutoComplete, Badge, Form, Input, notification, Spin } from 'antd';
import style from './Suggester.module.scss';
import { SearchOutlined } from '@ant-design/icons';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from 'store/rootState';
import {
  selectError,
  selectIsLoading,
  selectSuggestions,
  selectSearchTextSuggestion,
  selectChosenSuggestion as selectorChosenSuggestion,
} from 'store/selectors/genomicSuggester';
import { DispatchGenomicSuggester } from 'store/genomicSuggesterTypes';
import {
  clearSuggestions,
  fetchSuggestions,
  reInitializeState,
  selectChosenSuggestion,
} from 'store/actionCreators/genomicSuggester';
import debounce from 'lodash/debounce';
import generateSuggestionOptions from './SuggestionOptions';
import { SearchText, SelectedSuggestion } from 'store/graphql/variants/models';

const WAIT_IN_MS = 100;

const MIN_N_OF_CHARS_BEFORE_SEARCH = 2;

const MAX_N_OF_CHARS = 50;

const mapState = (state: RootState) => ({
  isLoading: selectIsLoading(state),
  suggestions: selectSuggestions(state),
  error: selectError(state),
  suggestionSearchText: selectSearchTextSuggestion(state),
  selectedSuggestion: selectorChosenSuggestion(state),
});

const mapDispatch = (dispatch: DispatchGenomicSuggester) => ({
  onFetchSuggestions: (searchText: SearchText) => dispatch(fetchSuggestions(searchText)),
  onSelectSuggestion: (params: SelectedSuggestion) => dispatch(selectChosenSuggestion(params)),
  reInitializeState: () => dispatch(reInitializeState()),
  onClearSuggestions: () => dispatch(clearSuggestions()),
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux;

const Suggester: FunctionComponent<Props> = (props) => {
  const {
    isLoading,
    error,
    reInitializeState,
    onFetchSuggestions,
    suggestions,
    onSelectSuggestion,
    onClearSuggestions,
    suggestionSearchText,
    selectedSuggestion,
  } = props;

  const handleSearch = (userRawInput: string) => {
    onClearSuggestions();
    if (userRawInput && userRawInput.length >= MIN_N_OF_CHARS_BEFORE_SEARCH) {
      return onFetchSuggestions(encodeURI(userRawInput));
    }
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
    <Form
      name={'genomicFeatureSuggester'}
      initialValues={{ variantSearch: selectedSuggestion?.displayName || '' }}
    >
      <Form.Item
        name="variantSearch"
        help="Search examples: 1-45331556-C-T, MUTYH, MUTYH G393D, rs36053993,
        ENSG00000132781, ENST00000372098, 5294 (Clinvar ID)"
      >
        <Badge count={'Beta'} offset={[0, -5]}>
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
              onSelectSuggestion({
                suggestionId: option.meta.suggestionId,
                featureType: option.meta.featureType,
                geneSymbol: option.meta.geneSymbol,
                displayName: option.meta.displayName,
              });
            }}
            disabled={!!error}
          >
            <Input
              prefix={<SearchOutlined />}
              maxLength={MAX_N_OF_CHARS}
              allowClear
              size="large"
              placeholder="Search..."
              onPressEnter={(e: any) => {
                e.preventDefault();
                const value = e.target.value;
                if (!value || !value.trim()) {
                  reInitializeState();
                }
              }}
            />
          </AutoComplete>
        </Badge>
      </Form.Item>
    </Form>
  );
};

export default connector(Suggester);
