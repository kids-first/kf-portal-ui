import DemographicsGraphCard from './DemographicGraphCard';
import DataCategoryGraphCard from './DataCategoryGraphCard';
import DataTypeGraphCard from './DataTypeGraphCard';
import SunburstGraphCard from './SunburstGraphCard';
import SortableGrid from '@ferlab/ui/core/layout/SortableGrid';
import { useDispatch } from 'react-redux';
import { updateUserConfig } from 'store/user/thunks';
import { useUser } from 'store/user';
import cx from 'classnames';
import { orderCardIfNeeded } from 'utils/helper';

import styles from './index.module.scss';
import AgeAtDiagnosisGraphCard from './AgeAtDiagnosisGraphCard';
import StudiesGraphCard from './StudiesGraphCard';

const SummaryTab = () => {
  const dispatch = useDispatch();
  const { userInfo } = useUser();

  return (
    <SortableGrid
      onReorder={(ids) =>
        dispatch(
          updateUserConfig({
            data_exploration: {
              summary: {
                cards: {
                  order: ids,
                },
              },
            },
          }),
        )
      }
      items={orderCardIfNeeded(
        [
          // Observed Phenotypes (HPO)
          {
            id: '1',
            lg: 24,
            xl: 12,
            className: styles.summaryGraphCardCol,
            component: (
              <SunburstGraphCard
                id="1"
                className={cx(styles.summaryGrapCard, styles.sunburstGraphCard)}
                field={'observed_phenotype'}
              />
            ),
          },
          // Diagnosis (MONDO)
          {
            id: '2',
            lg: 24,
            xl: 12,
            className: styles.summaryGraphCardCol,
            component: (
              <SunburstGraphCard
                id="2"
                className={cx(styles.summaryGrapCard, styles.sunburstGraphCard)}
                field={'mondo'}
              />
            ),
          },
          // Demographics
          {
            id: '3',
            lg: 24,
            xl: 12,
            className: styles.summaryGraphCardCol,
            component: <DemographicsGraphCard id="3" className={styles.summaryGrapCard} />,
          },
          // Age at Diagnosis
          {
            id: '5',
            lg: 24,
            xl: 12,
            className: styles.summaryGraphCardCol,
            component: <AgeAtDiagnosisGraphCard id="5" className={styles.summaryGrapCard} />,
          },
          // Studies
          {
            id: '6',
            lg: 24,
            xl: 12,
            className: styles.summaryGraphCardCol,
            component: <StudiesGraphCard id="6" className={styles.summaryGrapCard} />,
          },
          // Participants by Data Category
          {
            id: '7',
            lg: 24,
            xl: 12,
            className: styles.summaryGraphCardCol,
            component: <DataCategoryGraphCard id="7" className={styles.summaryGrapCard} />,
          },
          // Participants by Data Type
          {
            id: '8',
            lg: 24,
            xl: 12,
            component: <DataTypeGraphCard id="8" className={styles.summaryGrapCard} />,
          },
        ],
        userInfo?.config.data_exploration?.summary?.cards?.order,
      )}
      gutter={[24, 24]}
    />
  );
};

export default SummaryTab;
