import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import { ReadOutlined, UserOutlined } from '@ant-design/icons';
import { addQuery } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { numberWithCommas } from '@ferlab/ui/core/utils/numberUtils';
import { Tooltip } from 'antd';
import { INDEXES } from 'graphql/constants';
import { IVariantEntity } from '../../../graphql/variants/models';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';

import { STATIC_ROUTES } from 'utils/routes';

import styles from './index.module.scss';

const PARTICIPANT_SAFE_GUARD = 10;

interface OwnProps {
  variant?: IVariantEntity;
}

const SummaryHeader = ({ variant }: OwnProps) => {
  const studyCount = variant?.studies.hits.total || 0;
  const participantCount = variant?.internal_frequencies?.total?.pc || 0;
  const studyCodes = variant?.studies.hits.edges.map((e) => e?.node?.study_code) || [];

  const showParticipantsLink = participantCount >= PARTICIPANT_SAFE_GUARD;
  const participantsIdsFromAllStudies = showParticipantsLink
    ? variant?.studies.hits.edges.reduce((xs: string[], x) => {
        if (x.node.participant_ids?.length) {
          return [...xs, ...x.node.participant_ids];
        }
        return xs;
      }, [])
    : [];
  const uniqueParticipantsFromAllStudies = [...new Set(participantsIdsFromAllStudies)];
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
        <span className={styles.entityCount}>{numberWithCommas(studyCount)}</span>
        <span className={styles.text}>
          {intl.get('entities.study.count', { count: studyCount })}
        </span>
      </Link>

      {showParticipantsLink ? (
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
                    value: uniqueParticipantsFromAllStudies,
                    index: INDEXES.PARTICIPANT,
                  }),
                ],
              }),
              setAsActive: true,
            })
          }
        >
          <UserOutlined className={styles.icon} />
          <span className={styles.entityCount}>{numberWithCommas(participantCount)}</span>
          <span className={styles.text}>
            {intl.get('entities.variant.participant', {
              count: participantCount,
            })}
          </span>
        </Link>
      ) : (
        <Tooltip placement="top" title={intl.get('screen.variants.summary.participantsTooltip')}>
          <div className={styles.participantDisabled}>
            <UserOutlined className={styles.icon} />
            <span className={styles.entityCount}>{numberWithCommas(participantCount)}</span>
            <span className={styles.text}>
              {intl.get('entities.variant.participant', { count: participantCount })}
            </span>
          </div>
        </Tooltip>
      )}
    </div>
  );
};

export default SummaryHeader;
