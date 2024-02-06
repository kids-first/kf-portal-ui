import intl from 'react-intl-universal';
import { ExperimentOutlined } from '@ant-design/icons';
import useQueryBuilderState from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { ISqonGroupFilter } from '@ferlab/ui/core/data/sqon/types';
import { IBiospecimenEntity } from 'graphql/biospecimens/models';
import { BIOSPECIMEN_SEARCH_BY_ID_QUERY } from 'graphql/biospecimens/queries';
import useBiospecimenResolvedSqon from 'graphql/biospecimens/useBiospecimenResolvedSqon';
import { INDEXES } from 'graphql/constants';
import { uniqBy } from 'lodash';

import GlobalSearch, { ICustomSearchProps } from 'components/uiKit/search/GlobalSearch';
import { highlightSearchMatch } from 'components/uiKit/search/GlobalSearch/utils';
import SelectItem from 'components/uiKit/select/SelectItem';

const BiospecimenSearch = ({ queryBuilderId }: ICustomSearchProps) => {
  const { activeQuery } = useQueryBuilderState(queryBuilderId);

  return (
    <GlobalSearch<IBiospecimenEntity>
      queryBuilderId={queryBuilderId}
      field="sample_id" // @todo: search_text, see when implemented
      searchFields={['sample_id', 'external_sample_id']}
      index={INDEXES.BIOSPECIMEN}
      placeholder={intl.get('global.search.biospecimen.placeholder')}
      emptyDescription={intl.get('global.search.biospecimen.emptyText')}
      query={BIOSPECIMEN_SEARCH_BY_ID_QUERY}
      sqon={activeQuery as ISqonGroupFilter}
      optionsFormatter={(options, matchRegex, search) =>
        uniqBy(options, (opt) => opt.sample_id).map((option) => ({
          label: (
            <SelectItem
              icon={<ExperimentOutlined />}
              title={highlightSearchMatch(option.sample_id, matchRegex, search)}
              caption={highlightSearchMatch(option.external_sample_id, matchRegex, search)}
            />
          ),
          value: option.sample_id,
        }))
      }
      title={intl.get('global.search.biospecimen.title')}
      tooltipText={intl.get('global.search.biospecimen.tooltip')}
    />
  );
};

const BiospecimenCollectionSearch = ({ queryBuilderId }: ICustomSearchProps) => {
  const { sqon } = useBiospecimenResolvedSqon(queryBuilderId);

  return (
    <GlobalSearch<IBiospecimenEntity>
      queryBuilderId={queryBuilderId}
      field="collection_sample_id" // @todo: search_text, see when implemented
      index={INDEXES.BIOSPECIMEN}
      placeholder={intl.get('global.search.biospecimen.collection.placeholder')}
      emptyDescription={intl.get('global.search.biospecimen.collection.emptyText')}
      query={BIOSPECIMEN_SEARCH_BY_ID_QUERY}
      sqon={sqon}
      optionsFormatter={(options, matchRegex, search) =>
        uniqBy(options, (opt) => opt.collection_sample_id).map((option) => ({
          label: (
            <SelectItem
              icon={<ExperimentOutlined />}
              title={highlightSearchMatch(option.collection_sample_id, matchRegex, search)}
            />
          ),
          value: option.collection_sample_id,
        }))
      }
      title={intl.get('global.search.biospecimen.collection.title')}
    />
  );
};

export { BiospecimenSearch, BiospecimenCollectionSearch };
