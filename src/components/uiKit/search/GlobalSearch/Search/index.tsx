import { useState } from 'react';
import { BooleanOperators } from '@ferlab/ui/core/data/sqon/operators';
import { generateQuery, generateWildCardValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { DocumentNode } from 'graphql';
import { INDEXES } from 'graphql/constants';

import SearchAutocomplete, {
  ISearchAutocomplete,
  OptionsType,
} from 'components/uiKit/search/GlobalSearch/Search/SearchAutocomplete';
import { ArrangerApi } from 'services/api/arranger';
import { ISuggestionPayload } from 'services/api/arranger/models';

interface IGlobalSearch<T> {
  query: DocumentNode;
  index: INDEXES;
  searchKey: string[];
  setCurrentOptions: (result: T[], search: string) => OptionsType[];
  searchValueTransformer?: (search: string) => string;
  onSelect: (values: string[]) => void;
  customHandleSearch?: TCustomHandleSearch<T>;
}

export type TCustomHandleSearch<T> = (searchText: string) => Promise<ISuggestionPayload<T>>;
type TGlobalSearch<T> = IGlobalSearch<T> &
  Omit<ISearchAutocomplete, 'onClose' | 'onSearch' | 'onSelect' | 'options'>;

const Search = <T,>({
  onSelect,
  query,
  index,
  searchKey,
  selectedItems = [],
  setCurrentOptions,
  searchValueTransformer,
  customHandleSearch,
  ...props
}: TGlobalSearch<T>) => {
  const [options, setOptions] = useState<OptionsType[]>([]);

  const handleSearch = async (search: string) => {
    if (customHandleSearch && search) {
      const results = await customHandleSearch(search);
      setOptions(setCurrentOptions(results.suggestions, search));
    } else {
      const payload = {
        operator: BooleanOperators.or,
        newFilters: searchKey.map((key) =>
          generateWildCardValueFilter({
            fields: [key],
            value: [`*${search}*`],
            index,
          }),
        ),
      };
      const searchFilter = generateQuery(payload);

      const { data } = await ArrangerApi.graphqlRequest<any>({
        query: query.loc?.source.body,
        variables: {
          sqon: {
            op: searchFilter.op,
            content: searchFilter.content,
          },
        },
      });

      setOptions(setCurrentOptions(data?.data || [], search));
    }
  };

  return (
    <SearchAutocomplete
      onSearch={(value) =>
        handleSearch(searchValueTransformer ? searchValueTransformer(value) : value)
      }
      onSelect={onSelect}
      options={options}
      selectedItems={selectedItems}
      {...props}
    />
  );
};

export default Search;
