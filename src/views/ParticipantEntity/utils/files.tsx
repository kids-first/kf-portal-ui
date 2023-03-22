import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import { blue } from '@ant-design/colors';
import { TABLE_EMPTY_PLACE_HOLDER } from '@ferlab/ui/core/common/constants';
import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';
import { addQuery } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { hydrateResults } from '@ferlab/ui/core/graphql/utils';
import { Progress } from 'antd';
import { INDEXES } from 'graphql/constants';
import { IFileEntity } from 'graphql/files/models';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';

import styleThemeColors from 'style/themes/kids-first/colors.module.scss';
import { STATIC_ROUTES } from 'utils/routes';

interface IFileInfoByType {
  key: string;
  value: string;
  nb_files: number;
  proportion_of_files: number;
  participant_id: string;
}

export const getFilesDataTypeInfo = (files: IFileEntity[], participant_id?: string) => {
  const filesInfosData: IFileInfoByType[] = [];
  for (const file of files) {
    const filesFound = files.filter(({ data_type }) => data_type === file.data_type);
    if (!filesInfosData.find((f) => f.value === file.data_type)) {
      filesInfosData.push({
        key: file.data_type,
        value: file.data_type,
        nb_files: filesFound.length,
        proportion_of_files: (filesFound.length / files.length) * 100,
        participant_id: participant_id || '',
      });
    }
  }
  return filesInfosData;
};

/** Computed all experimental strategy. Only count once per file */
export const getFilesByExperimentalStrategy = (files: IFileEntity[], participant_id?: string) => {
  const experimentalStrategyFilteredResult: { [key: string]: number } = {
    WXS: 0,
    WGS: 0,
    'RNA-Seq': 0,
    Methylation: 0,
    'miRNA-Seq': 0,
    'Linked-Read WGS (10x Chromium)': 0,
    'Targeted Sequencing': 0,
  };

  // Create a list of all experiment strategy available
  for (const file of files) {
    const filters: string[] = [];
    hydrateResults(file.sequencing_experiment?.hits?.edges || []).forEach((node) => {
      if (filters.includes(node.experiment_strategy)) {
        return;
      }
      filters.push(node.experiment_strategy);
    });

    filters.forEach((se) => {
      if (!experimentalStrategyFilteredResult[se]) {
        experimentalStrategyFilteredResult[se] = 0;
      }
      experimentalStrategyFilteredResult[se] += 1;
    });
  }

  return Object.keys(experimentalStrategyFilteredResult).map((key) => ({
    key,
    value: key,
    nb_files: experimentalStrategyFilteredResult[key],
    proportion_of_files: (experimentalStrategyFilteredResult[key] / files.length) * 100,
    participant_id: participant_id || '',
  }));
};

export const getExperimentalStrategyColumns = (files_nb: number): ProColumnType<any>[] => [
  {
    key: 'value',
    dataIndex: 'value',
    title: intl.get('screen.participantEntity.files.sequencing_experiment.experimental_strategy'),
    render: (label: string) => label || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'nb_files',
    title: intl.get('screen.participantEntity.files.files'),
    render: (filesInfo: IFileInfoByType) =>
      (
        <Link
          to={STATIC_ROUTES.DATA_EXPLORATION_DATAFILES}
          onClick={() =>
            addQuery({
              queryBuilderId: DATA_EXPLORATION_QB_ID,
              query: generateQuery({
                newFilters: [
                  generateValueFilter({
                    field: 'participant_id',
                    value: [filesInfo.participant_id],
                    index: INDEXES.PARTICIPANT,
                  }),
                  generateValueFilter({
                    field: 'sequencing_experiment.experiment_strategy',
                    value: [filesInfo.value],
                    index: INDEXES.FILES,
                  }),
                ],
              }),
              setAsActive: true,
            })
          }
        >
          {filesInfo.nb_files}
        </Link>
      ) || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'proportion_of_files',
    dataIndex: 'proportion_of_files',
    title: intl.get('screen.participantEntity.files.totalNumberOfFiles', { count: files_nb }),
    tooltip: intl.get('screen.participantEntity.files.numberByDataTypesTooltip'),
    render: (percent: number) => (
      <Progress
        percent={percent}
        showInfo={false}
        strokeColor={styleThemeColors.blueBase}
        trailColor={styleThemeColors.grayBase}
      />
    ),
  },
];

export const getDataTypeColumns = (files_nb: number): ProColumnType<any>[] => [
  {
    key: 'value',
    dataIndex: 'value',
    title: intl.get('screen.participantEntity.files.dataType'),
    render: (label: string) => label || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'nb_files',
    title: intl.get('screen.participantEntity.files.files'),
    render: (filesInfo: IFileInfoByType) =>
      (
        <Link
          to={STATIC_ROUTES.DATA_EXPLORATION_DATAFILES}
          onClick={() =>
            addQuery({
              queryBuilderId: DATA_EXPLORATION_QB_ID,
              query: generateQuery({
                newFilters: [
                  generateValueFilter({
                    field: 'participant_id',
                    value: [filesInfo.participant_id],
                    index: INDEXES.PARTICIPANT,
                  }),
                  generateValueFilter({
                    field: 'data_type',
                    value: [filesInfo.value],
                    index: INDEXES.FILES,
                  }),
                ],
              }),
              setAsActive: true,
            })
          }
        >
          {filesInfo.nb_files}
        </Link>
      ) || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'proportion_of_files',
    dataIndex: 'proportion_of_files',
    title: intl.get('screen.participantEntity.files.totalNumberOfFiles', { count: files_nb }),
    tooltip: intl.get('screen.participantEntity.files.numberByDataTypesTooltip'),
    render: (percent: number) => (
      <Progress
        percent={percent}
        showInfo={false}
        strokeColor={styleThemeColors.blueBase}
        trailColor={styleThemeColors.grayBase}
      />
    ),
  },
];
