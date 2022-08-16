import intl from 'react-intl-universal';
import useQueryBuilderState from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { ISqonGroupFilter } from '@ferlab/ui/core/data/sqon/types';
import { INDEXES } from 'graphql/constants';
import { SEARCH_VARIANT_BY_ID_QUERY } from 'graphql/variants/queries';

import GlobalSearch, { ICustomSearchProps } from 'components/uiKit/search/GlobalSearch';
import { ArrangerApi } from 'services/api/arranger';
import { Suggestion, SuggestionType } from 'services/api/arranger/models';

import OptionItem from './OptionItem';

type OwnProps = ICustomSearchProps & {
  type: SuggestionType;
};

export const getValue = (type: SuggestionType, option: Suggestion) =>
  type === SuggestionType.GENES ? option.symbol! : option.locus!;

const VariantGeneSearch = ({ queryBuilderId, type }: OwnProps) => {
  const { activeQuery } = useQueryBuilderState(queryBuilderId);

  const handleSearch = async (searchText: string) => {
    const { data } = await ArrangerApi.searchSuggestions(type, searchText);
    return data!;
  };

  return (
    <GlobalSearch<Suggestion>
      queryBuilderId={queryBuilderId}
      field={type === SuggestionType.VARIANTS ? 'locus' : 'consequences.symbol'}
      index={INDEXES.VARIANT}
      placeholder={intl.get(`global.search.${type}.placeholder`)}
      emptyDescription={intl.get(`global.search.${type}.emptyText`)}
      searchFields={[]}
      tooltipText={intl.get(`global.search.${type}.tooltip`)}
      query={SEARCH_VARIANT_BY_ID_QUERY}
      sqon={activeQuery as ISqonGroupFilter}
      handleSearch={handleSearch}
      optionsFormatter={(options) =>
        options.map((option) => ({
          label: <OptionItem type={type} suggestion={option} value={getValue(type, option)} />,
          value: getValue(type, option),
        }))
      }
      title={intl.get(`global.search.${type}.title`)}
      limit={4}
    />
  );
};

export default VariantGeneSearch;
