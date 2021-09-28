import React, { useEffect, useState } from 'react';
import { IFilter, VisualType } from '@ferlab/ui/core/components/filters/types';
import { updateFilters } from '@ferlab/ui/core/data/filters/utils';
import { AutoComplete, Input, notification, Spin } from 'antd';

import { getGenomicSuggestions } from 'services/genomicSuggestions';
import history from 'services/history';

import generateSuggestionOptions from './SuggestionOptions';

import style from './Suggester.module.scss';

const MIN_N_OF_CHARS_BEFORE_SEARCH = 2;

const MAX_N_OF_CHARS = 50;

type SuggesterProps = {
  suggestionType: string;
  placeholderText: string;
  title: string;
};

const Suggester = (props: SuggesterProps) => {
  const { suggestionType, placeholderText } = props;

  const [options, setOptions] = useState<{ value: string }[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (userRawInput: string, suggestionType: string) => {
    if (userRawInput && userRawInput.length >= MIN_N_OF_CHARS_BEFORE_SEARCH) {
      setLoading(true);
      try {
        const response = await getGenomicSuggestions(userRawInput, suggestionType);
        setOptions(generateSuggestionOptions(response.searchText, response.suggestions));
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
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
        field: 'genes.symbol',
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
        onClose: () => setError(false),
      });
    }
  }, [error]);

  return (
    <AutoComplete
      className={style.inputVariant}
      style={{ width: style.autoCompleteWidth }}
      onSearch={(searchText) => handleSearch(searchText, suggestionType)}
      options={options}
      notFoundContent={loading ? <Spin /> : 'No results found'}
      filterOption={(inputValue, option) =>
        //  make sure we show suggestions for corresponding search only.
        (inputValue || '').trim() === option?.meta?.searchText
      }
      onSelect={(value, option) => {
        onSelectSuggestion(option.meta.featureType, option.meta.displayName);
      }}
      disabled={error}
    >
      <Input
        maxLength={MAX_N_OF_CHARS}
        allowClear
        size="middle"
        placeholder={placeholderText}
        onPressEnter={(e: any) => {
          e.preventDefault();
          const value = e.target.value;
          if (!value || !value.trim()) {
            const opt: { value: string }[] = [];
            setOptions(opt);
          }
        }}
      />
    </AutoComplete>
  );
};

export default Suggester;
