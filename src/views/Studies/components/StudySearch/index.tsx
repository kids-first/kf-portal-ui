import intl from 'react-intl-universal';
import { FileTextOutlined } from '@ant-design/icons';
import useQueryBuilderState from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { ISqonGroupFilter } from '@ferlab/ui/core/data/sqon/types';
import { INDEXES } from 'graphql/constants';

import GlobalSearch, { ICustomSearchProps } from 'components/uiKit/search/GlobalSearch';
import { highlightSearchMatch } from 'components/uiKit/search/GlobalSearch/utils';
import SelectItem from 'components/uiKit/select/SelectItem';
import { SEARCH_STUDIES_BY_ID_AND_NAME_QUERY } from 'graphql/studies/queries';
import { IStudiesEntity } from 'graphql/studies/models';

const StudySearch = ({ queryBuilderId }: ICustomSearchProps) => {
  const { activeQuery } = useQueryBuilderState(queryBuilderId);

  return (
    <GlobalSearch<IStudiesEntity>
      queryBuilderId={queryBuilderId}
      field="study_id"
      searchFields={['study_id', 'study_name', 'external_id']}
      tooltipText={intl.get('global.search.study.tooltip')}
      index={INDEXES.STUDIES}
      placeholder={intl.get(`global.search.study.placeholder`)}
      emptyDescription={intl.get(`global.search.study.emptyText`)}
      query={SEARCH_STUDIES_BY_ID_AND_NAME_QUERY}
      sqon={activeQuery as ISqonGroupFilter}
      optionsFormatter={(options, matchRegex, search) =>
        options.map((option) => ({
          label: (
            <SelectItem
              icon={<FileTextOutlined />}
              title={highlightSearchMatch(option.study_id, matchRegex, search)}
              caption={highlightSearchMatch(option.study_name, matchRegex, search)}
            />
          ),
          value: option.study_id,
        }))
      }
      title={intl.get(`global.search.study.title`)}
    />
  );
};

export default StudySearch;
