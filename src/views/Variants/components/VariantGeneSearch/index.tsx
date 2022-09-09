import intl from 'react-intl-universal';
import { updateActiveQueryField } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { MERGE_VALUES_STRATEGIES } from '@ferlab/ui/core/data/sqon/types';
import { INDEXES } from 'graphql/constants';

import { ICustomSearchProps } from 'components/uiKit/search/GlobalSearch';
import { ArrangerApi } from 'services/api/arranger';
import { Suggestion, SuggestionType } from 'services/api/arranger/models';

import OptionItem from './OptionItem';
import SearchAutocomplete, {
  OptionsType,
} from 'components/uiKit/search/GlobalSearch/Search/SearchAutocomplete';
import { useState } from 'react';

type OwnProps = ICustomSearchProps & {
  type: SuggestionType;
};

const getValue = (type: SuggestionType, option: Suggestion) =>
  (type === SuggestionType.GENES ? option.symbol : option.locus) ?? '';

const VariantGeneSearch = ({ queryBuilderId, type }: OwnProps) => {
  const [options, setOptions] = useState<OptionsType[]>([]);

  const handleSearch = async (searchText: string) => {
    const { data } = await ArrangerApi.searchSuggestions(type, searchText);
    setOptions(
      data?.suggestions?.map((s) => ({
        label: <OptionItem type={type} suggestion={s} value={getValue(type, s)} />,
        value: getValue(type, s),
      })) ?? [],
    );
    return;
  };

  return (
    <SearchAutocomplete
      onSearch={(value) => handleSearch(value)}
      onSelect={(values) =>
        updateActiveQueryField({
          queryBuilderId,
          field: type === SuggestionType.VARIANTS ? 'locus' : 'consequences.symbol',
          value: values,
          index: INDEXES.VARIANTS,
          merge_strategy: MERGE_VALUES_STRATEGIES.OVERRIDE_VALUES,
        })
      }
      placeHolder={intl.get(`global.search.${type}.placeholder`)}
      options={options}
      selectedItems={[]}
      title={'Search by Variant ID'}
      emptyDescription={intl.get(`global.search.${type}.emptyText`)}
      tooltipText={intl.get(`global.search.${type}.tooltip`)}
    />
  );
};

export default VariantGeneSearch;
