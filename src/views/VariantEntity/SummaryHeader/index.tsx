import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import { ReadOutlined, UserOutlined } from '@ant-design/icons';
import { addQuery } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { IVariantEntity } from '@ferlab/ui/core/pages/EntityPage/type';
import { Tooltip } from 'antd';
import { INDEXES } from 'graphql/constants';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';

import { STATIC_ROUTES } from 'utils/routes';

import { IVariantStudyEntity } from '../../../graphql/variants/models';

import styles from './index.module.scss';

const PARTICIPANT_SAFE_GUARD = 10;

interface OwnProps {
  variant?: IVariantEntity;
}

const SummaryHeader = ({ variant }: OwnProps) => {
  const studyCount = variant?.studies.hits.total || 0;
  const participantCount = variant?.participant_number || 0;
  const studyCodes =
    variant?.studies.hits.edges.map((e) => (e.node as IVariantStudyEntity).study_code) || [];
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
                  value: studyCodes,
                  index: '',
                }),
              ],
            }),
            setAsActive: true,
          })
        }
      >
        <ReadOutlined className={styles.icon} />
        <span className={styles.entityCount}>{studyCount}</span>
        <span className={styles.text}>
          {intl.get('entities.file.summary.studies', { count: studyCount })}
        </span>
      </Link>

      {participantCount >= PARTICIPANT_SAFE_GUARD ? (
        <Link
          to={STATIC_ROUTES.DATA_EXPLORATION_PARTICIPANTS}
          className={styles.link}
          onClick={() =>
            addQuery({
              queryBuilderId: DATA_EXPLORATION_QB_ID,
              query: generateQuery({
                newFilters: [
                  generateValueFilter({
                    field: 'participant_id',
                    value: variant ? [] : [],
                    index: INDEXES.PARTICIPANT,
                  }),
                ],
              }),
              setAsActive: true,
            })
          }
        >
          <UserOutlined className={styles.icon} />
          <span className={styles.entityCount}>{participantCount}</span>
          <span className={styles.text}>
            {intl.get('entities.file.summary.participants', { count: participantCount })}
          </span>
        </Link>
      ) : (
        <Tooltip placement="top" title={intl.get('screen.variants.summary.participantsTooltip')}>
          <div className={styles.participantDisabled}>
            <UserOutlined className={styles.icon} />
            <span className={styles.entityCount}>{participantCount}</span>
            <span className={styles.text}>
              {intl.get('screen.variants.summary.participants', { count: participantCount })}
            </span>
          </div>
        </Tooltip>
      )}
    </div>
  );
};

export default SummaryHeader;
