import { useState } from 'react';
import intl from 'react-intl-universal';
import useQueryBuilderState, {
  updateActiveQueryField,
} from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { ISqonGroupFilter, MERGE_VALUES_STRATEGIES } from '@ferlab/ui/core/data/sqon/types';
import { findSqonValueByField } from '@ferlab/ui/core/data/sqon/utils';
import { INDEXES } from 'graphql/constants';
import { VARIANT_REPO_QB_ID } from '../../utils/constants';

import { ICustomSearchProps } from 'components/uiKit/search/GlobalSearch';
import SearchAutocomplete, {
  OptionsType,
} from 'components/uiKit/search/GlobalSearch/Search/SearchAutocomplete';
import { ArrangerApi } from 'services/api/arranger';
import { Suggestion, SuggestionType } from 'services/api/arranger/models';

import OptionItem from './OptionItem';

type OwnProps = ICustomSearchProps & {
  type: SuggestionType;
};

const getValue = (type: SuggestionType, option: Suggestion) =>
  (type === SuggestionType.GENES ? option.symbol : option.locus) ?? '';

const VariantGeneSearch = ({ queryBuilderId, type }: OwnProps) => {
  const [options, setOptions] = useState<OptionsType[]>([]);
  const { activeQuery } = useQueryBuilderState(VARIANT_REPO_QB_ID);
  const field = type === SuggestionType.VARIANTS ? 'locus' : 'genes.symbol';

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
          field,
          value: values,
          index: INDEXES.VARIANTS,
          merge_strategy: MERGE_VALUES_STRATEGIES.OVERRIDE_VALUES,
        })
      }
      placeHolder={intl.get(`global.search.${type}.placeholder`)}
      options={options}
      selectedItems={
        (findSqonValueByField(field, activeQuery as ISqonGroupFilter) as string[]) ?? []
      }
      title={intl.get(`global.search.${type}.title`)}
      emptyDescription={intl.get(`global.search.${type}.emptyText`)}
      tooltipText={intl.get(`global.search.${type}.tooltip`)}
    />
  );
};

export default VariantGeneSearch;
