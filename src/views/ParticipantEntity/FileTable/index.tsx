import intl from 'react-intl-universal';
import { useNavigate } from 'react-router';
import { addQuery } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { EntityTableMultiple } from '@ferlab/ui/core/pages/EntityPage';
import { INDEXES } from 'graphql/constants';
import { IFileEntity } from 'graphql/files/models';
import { useDataFileAgg } from 'graphql/participants/actions';
import { IParticipantEntity } from 'graphql/participants/models';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';

import ExternalLinkIcon from 'components/Icons/ExternalLinkIcon';
import { STATIC_ROUTES } from 'utils/routes';

import { SectionId } from '../utils/anchorLinks';
import {
  getDataCategoryColumns,
  getExperimentalStrategyColumns,
  getFilesInfoByType,
} from '../utils/files';

import styles from '../index.module.scss';
import { Button } from 'antd';

interface IFilesTableProps {
  participant?: IParticipantEntity;
  loading: boolean;
}

const FileTable = ({ participant, loading: participantLoading }: IFilesTableProps) => {
  const navigate = useNavigate();
  const participantId = participant?.participant_id || '';

  const files: IFileEntity[] = participant?.files?.hits.edges.map(({ node }) => node) || [];
  const fileCount = participant?.nb_files || 0;

  const { loading: dataFileLoading, dataFileAgg } = useDataFileAgg();

  const dataCategoryInfo = getFilesInfoByType({
    files: files.filter((file) => file?.data_category),
    allTypes: dataFileAgg?.data_category?.buckets?.map((dataCategory) => dataCategory.key) || [],
    callbackFilter: (file: IFileEntity, type: string) => file.data_category === type,
    participantId,
  });

  const experimentalStrategyInfo = getFilesInfoByType({
    files: files.filter((file) => file?.sequencing_experiment),
    allTypes: dataFileAgg?.exp_strategies?.buckets?.map((x) => x.key) || [],
    callbackFilter: (file: IFileEntity, type: string) =>
      file.sequencing_experiment.hits.edges.some((e) => e.node.experiment_strategy === type),
    participantId,
  });

  return (
    <div>
      <EntityTableMultiple
        total={fileCount}
        id={SectionId.FILES}
        loading={participantLoading || dataFileLoading}
        title={intl.get('entities.file.file')}
        titleExtra={[
          <Button
            className={styles.viewInExplo}
            size="small"
            onClick={() => {
              addQuery({
                queryBuilderId: DATA_EXPLORATION_QB_ID,
                query: generateQuery({
                  newFilters: [
                    generateValueFilter({
                      field: 'participant_id',
                      value: participant ? [participant.participant_id] : [],
                      index: INDEXES.PARTICIPANT,
                    }),
                  ],
                }),
                setAsActive: true,
              });
              navigate(STATIC_ROUTES.DATA_EXPLORATION_DATAFILES);
            }}
          >
            {intl.get('global.viewInExploration')}
            <ExternalLinkIcon />
          </Button>,
        ]}
        header={intl.get('entities.file.file')}
        tables={[
          {
            columns: getDataCategoryColumns(fileCount, participantId),
            data: dataCategoryInfo,
            subTitle: intl.get('entities.file.data_category_count'),
          },
          {
            columns: getExperimentalStrategyColumns(fileCount),
            data: experimentalStrategyInfo,
            subTitle: intl.get('entities.file.experimental_strategy_count'),
          },
        ]}
      />
    </div>
  );
};
export default FileTable;
