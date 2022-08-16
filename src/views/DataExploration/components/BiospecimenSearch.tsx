import { ExperimentOutlined } from '@ant-design/icons';
import useQueryBuilderState from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { ISqonGroupFilter } from '@ferlab/ui/core/data/sqon/types';
import GlobalSearch, { ICustomSearchProps } from 'components/uiKit/search/GlobalSearch';
import { highlightSearchMatch } from 'components/uiKit/search/GlobalSearch/utils';
import SelectItem from 'components/uiKit/select/SelectItem';
import { IBiospecimenEntity } from 'graphql/biospecimens/models';
import { BIOSPECIMEN_SEARCH_BY_ID_QUERY } from 'graphql/biospecimens/queries';
import useBiospecimenResolvedSqon from 'graphql/biospecimens/useBiospecimenResolvedSqon';
import { INDEXES } from 'graphql/constants';
import { uniqBy } from 'lodash';

const BiospecimenSearch = ({ queryBuilderId }: ICustomSearchProps) => {
  const { activeQuery } = useQueryBuilderState(queryBuilderId);

  return (
    <GlobalSearch<IBiospecimenEntity>
      queryBuilderId={queryBuilderId}
      field="sample_id"
      index={INDEXES.BIOSPECIMEN}
      placeholder={'e.g. BS_011DYZ2J, HTP0001B2_Plasma'}
      emptyDescription={'No samples found'}
      query={BIOSPECIMEN_SEARCH_BY_ID_QUERY}
      sqon={activeQuery as ISqonGroupFilter}
      optionsFormatter={(options, matchRegex, search) =>
        uniqBy(options, (opt) => opt.sample_id).map((option) => ({
          label: (
            <SelectItem
              icon={<ExperimentOutlined />}
              title={highlightSearchMatch(option.sample_id, matchRegex, search)}
            />
          ),
          value: option.sample_id,
        }))
      }
      title={'Search by Sample ID'}
    />
  );
};

const BiospecimenCollectionSearch = ({ queryBuilderId }: ICustomSearchProps) => {
  const { sqon } = useBiospecimenResolvedSqon(queryBuilderId);

  return (
    <GlobalSearch<IBiospecimenEntity>
      queryBuilderId={queryBuilderId}
      field="collection_sample_id"
      index={INDEXES.BIOSPECIMEN}
      placeholder={'e.g. HTP0001B2_Whole blood, BS_1YEZ2XR4_Saliva'}
      emptyDescription={'No collection ID found'}
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
      title={'Search by Collection ID'}
    />
  );
};

export { BiospecimenSearch, BiospecimenCollectionSearch };
