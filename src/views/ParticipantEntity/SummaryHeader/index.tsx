import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import { FileTextOutlined, ReadOutlined } from '@ant-design/icons';
import { addQuery } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { FieldOperators } from '@ferlab/ui/core/data/sqon/operators';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { useBiospecimenParticipant } from 'graphql/biospecimens/actions';
import { IBiospecimenEntity } from 'graphql/biospecimens/models';
import { INDEXES } from 'graphql/constants';
import { IParticipantEntity } from 'graphql/participants/models';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';

import BiospecimenIcon from 'components/Icons/BiospecimenIcon';
import { STATIC_ROUTES } from 'utils/routes';

import styles from './index.module.scss';

interface OwnProps {
  data?: IParticipantEntity;
}

const SummaryHeader = ({ data }: OwnProps) => {
  const filesCount = data?.files.hits.total;

  const { data: biospecimens, loading } = useBiospecimenParticipant({
    field: 'participant.participant_id',
    values: data ? [data?.participant_id] : [],
  });

  console.log('biospecimens', biospecimens); //TODO: to remove

  return (
    <div className={styles.container}>
      <Link
        to={STATIC_ROUTES.DATA_EXPLORATION_PARTICIPANTS}
        className={styles.link}
        onClick={() =>
          addQuery({
            queryBuilderId: DATA_EXPLORATION_QB_ID,
            query: generateQuery({
              newFilters: [
                generateValueFilter({
                  field: 'study.study_code',
                  value: data ? [data.study.study_code] : [],
                  index: INDEXES.VARIANTS,
                  operator: FieldOperators.between,
                }),
              ],
            }),
            setAsActive: true,
          })
        }
      >
        <ReadOutlined className={styles.icon} />
        <span className={styles.entityCount}>1</span>
        <span className={styles.text}>
          {intl.get('screen.participantEntity.summaryHeader.studies', { count: 1 })}
        </span>
      </Link>

      <Link
        to={STATIC_ROUTES.DATA_EXPLORATION_DATAFILES}
        className={styles.link}
        onClick={() =>
          addQuery({
            queryBuilderId: DATA_EXPLORATION_QB_ID,
            query: generateQuery({
              newFilters: [
                generateValueFilter({
                  field: 'participant_id',
                  value: data ? [data.participant_id] : [],
                  index: INDEXES.PARTICIPANT,
                  operator: FieldOperators.between,
                }),
              ],
            }),
            setAsActive: true,
          })
        }
      >
        <FileTextOutlined className={styles.icon} />
        <span className={styles.entityCount}>{filesCount}</span>
        <span className={styles.text}>
          {intl.get('screen.participantEntity.summaryHeader.files', { count: filesCount })}
        </span>
      </Link>

      <Link
        to={STATIC_ROUTES.DATA_EXPLORATION_BIOSPECIMENS}
        className={styles.link}
        onClick={() =>
          addQuery({
            queryBuilderId: DATA_EXPLORATION_QB_ID,
            query: generateQuery({
              newFilters: [
                generateValueFilter({
                  field: 'sample_id',
                  value: biospecimens.map(
                    (biospecimen: IBiospecimenEntity) => biospecimen.sample_id,
                  ),
                  index: INDEXES.BIOSPECIMENS,
                  operator: FieldOperators.between,
                  overrideValuesName: 'Biospecimen ID',
                }),
              ],
            }),
            setAsActive: true,
          })
        }
      >
        <BiospecimenIcon className={styles.icon} />
        <span className={styles.entityCount}>{data?.nb_biospecimens}</span>
        <span className={styles.text}>
          {intl.get('entities.file.summary.biospecimens', { count: data?.nb_biospecimens })}
        </span>
      </Link>
    </div>
  );
};

export default SummaryHeader;
