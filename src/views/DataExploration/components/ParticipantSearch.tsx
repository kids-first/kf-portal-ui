import intl from 'react-intl-universal';
import { UserOutlined } from '@ant-design/icons';
import useQueryBuilderState from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { ISqonGroupFilter } from '@ferlab/ui/core/data/sqon/types';
import { INDEXES } from 'graphql/constants';
import { IParticipantEntity } from 'graphql/participants/models';
import { PARTICIPANT_SEARCH_BY_ID_QUERY } from 'graphql/participants/queries';

import GlobalSearch, { ICustomSearchProps } from 'components/uiKit/search/GlobalSearch';
import { highlightSearchMatch } from 'components/uiKit/search/GlobalSearch/utils';
import SelectItem from 'components/uiKit/select/SelectItem';

const ParticipantSearch = ({ queryBuilderId }: ICustomSearchProps) => {
  const { activeQuery } = useQueryBuilderState(queryBuilderId);

  return (
    <GlobalSearch<IParticipantEntity>
      queryBuilderId={queryBuilderId}
      field="participant_id"
      searchFields={['participant_id', 'external_id', 'families_id']}
      index={INDEXES.PARTICIPANT}
      placeholder={intl.get('global.search.participant.placeholder')}
      emptyDescription={intl.get('global.search.participant.emptyText')}
      query={PARTICIPANT_SEARCH_BY_ID_QUERY}
      sqon={activeQuery as ISqonGroupFilter}
      optionsFormatter={(options, matchRegex, search) =>
        options.map((option) => ({
          label: (
            <SelectItem
              icon={<UserOutlined />}
              title={highlightSearchMatch(option.participant_id, matchRegex, search)}
              caption={highlightSearchMatch(option.external_id, matchRegex, search)}
            />
          ),
          value: option.participant_id,
        }))
      }
      title={intl.get('global.search.participant.title')}
      tooltipText={intl.get('global.search.participant.tooltip')}
    />
  );
};

export default ParticipantSearch;
