import { updateActiveQueryField } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { ISqonGroupFilter, MERGE_VALUES_STRATEGIES } from '@ferlab/ui/core/data/sqon/types';
import { findSqonValueByField } from '@ferlab/ui/core/data/sqon/utils';
import Search, { TCustomHandleSearch } from 'components/uiKit/search/GlobalSearch/Search';
import { OptionsType } from 'components/uiKit/search/GlobalSearch/Search/SearchAutocomplete';
import { DocumentNode } from 'graphql';
import { INDEXES } from 'graphql/constants';
import { get } from 'lodash';

export interface ICustomSearchProps {
  queryBuilderId: string;
}

interface OwnProps<T> {
  queryBuilderId: string;
  title: string;
  placeholder: string;
  field: string;
  emptyDescription?: string;
  searchFields?: string[];
  index: INDEXES;
  query: DocumentNode;
  sqon: ISqonGroupFilter;
  tooltipText?: string;
  handleSearch?: TCustomHandleSearch<T>;
  limit?: number;
  optionsFormatter: (options: T[], matchRegex: RegExp, search: string) => OptionsType[];
}

const GlobalSearch = <T,>({
  queryBuilderId,
  title,
  placeholder,
  emptyDescription,
  field,
  searchFields,
  index,
  query,
  sqon,
  optionsFormatter,
  tooltipText,
}: OwnProps<T>) => (
  <Search<T>
    onSelect={(values) =>
      updateActiveQueryField({
        queryBuilderId,
        field,
        value: values,
        index,
        merge_strategy: MERGE_VALUES_STRATEGIES.OVERRIDE_VALUES,
      })
    }
    searchValueTransformer={(value) => value.toUpperCase()}
    index={index}
    tooltipText={tooltipText}
    emptyDescription={emptyDescription}
    placeHolder={placeholder}
    query={query}
    searchKey={searchFields ?? [field]}
    selectedItems={findSqonValueByField(field, sqon) as string[]}
    setCurrentOptions={(options, search) =>
      optionsFormatter(
        (get(options, `${index}.hits.edges`, []) as any[]).map(({ node }) => ({
          ...node,
        })),
        new RegExp(search.replace(/[-/\\^$*+?.()|[\]{}]/g, ''), 'gi'),
        search,
      )
    }
    title={title}
  />
);

export default GlobalSearch;
