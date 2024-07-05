import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import { FileImageOutlined, ReadOutlined } from '@ant-design/icons';
import { addQuery } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { INDEXES } from 'graphql/constants';
import { IParticipantEntity } from 'graphql/participants/models';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';

import BiospecimenIcon from 'components/Icons/BiospecimenIcon';
import { STATIC_ROUTES } from 'utils/routes';

import styles from './index.module.css';

interface OwnProps {
  participant?: IParticipantEntity;
}

const SummaryHeader = ({ participant }: OwnProps) => {
  const studyCount = 1;
  const fileCount = participant?.nb_files || 0;
  const biospecimenCount = participant?.nb_biospecimens || 0;

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
                  value: participant ? [participant.study.study_code] : [],
                  index: INDEXES.PARTICIPANT,
                }),
              ],
            }),
            setAsActive: true,
          })
        }
      >
        <ReadOutlined className={styles.readOutlinedIcon} />
        <span className={styles.count}>{studyCount}</span>
        <span className={styles.text}>
          {intl.get('entities.study.count', { count: studyCount })}
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
                  field: 'participant_id',
                  value: participant ? [participant.participant_id] : [],
                  index: INDEXES.PARTICIPANT,
                }),
              ],
            }),
            setAsActive: true,
          })
        }
      >
        <BiospecimenIcon className={styles.icon} />
        <span className={styles.count}>{biospecimenCount}</span>
        <span className={styles.text}>
          {intl.get('entities.biospecimen.count', { count: biospecimenCount })}
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
                  value: participant ? [participant.participant_id] : [],
                  index: INDEXES.PARTICIPANT,
                }),
              ],
            }),
            setAsActive: true,
          })
        }
      >
        <FileImageOutlined className={styles.icon} />
        <span className={styles.count}>{fileCount}</span>
        <span className={styles.text}>{intl.get('entities.file.count', { count: fileCount })}</span>
      </Link>
    </div>
  );
};

export default SummaryHeader;
