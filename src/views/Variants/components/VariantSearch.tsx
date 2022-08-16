import { FileTextOutlined } from '@ant-design/icons';
import useQueryBuilderState from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { ISqonGroupFilter } from '@ferlab/ui/core/data/sqon/types';
import { INDEXES } from 'graphql/constants';
import { IVariantEntity } from 'graphql/variants/models';
import { SEARCH_VARIANT_BY_ID_QUERY } from 'graphql/variants/queries';

import GlobalSearch, { ICustomSearchProps } from 'components/uiKit/search/GlobalSearch';
import { highlightSearchMatch } from 'components/uiKit/search/GlobalSearch/utils';
import SelectItem from 'components/uiKit/select/SelectItem';

const VariantSearch = ({ queryBuilderId }: ICustomSearchProps) => {
  const { activeQuery } = useQueryBuilderState(queryBuilderId);

  return (
    <GlobalSearch<IVariantEntity>
      queryBuilderId={queryBuilderId}
      field="id"
      index={INDEXES.VARIANT}
      placeholder={'e.g. GF_001CSF26'}
      emptyDescription={'No variant found'}
      query={SEARCH_VARIANT_BY_ID_QUERY}
      sqon={activeQuery as ISqonGroupFilter}
      optionsFormatter={(options, matchRegex, search) =>
        options.map((option) => ({
          label: (
            <SelectItem
              icon={<FileTextOutlined />}
              title={highlightSearchMatch(option.id, matchRegex, search)}
            />
          ),
          value: option.id,
        }))
      }
      title={'Search by Variant ID'}
    />
  );
};

export default VariantSearch;
