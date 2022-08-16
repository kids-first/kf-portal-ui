import SortableGrid from '@ferlab/ui/core/layout/SortableGrid';
import GridCard from '@ferlab/ui/core/view/v2/GridCard';

import styles from './index.module.scss';

const SummaryTab = () => {
  return (
    <SortableGrid
      items={[
        {
          id: '1',
          lg: 24,
          xl: 12,
          className: styles.summaryGraphCardCol,
          component: <GridCard theme="shade" title="Card title" content={'Content'} />,
        },
        {
          id: '2',
          lg: 24,
          xl: 12,
          className: styles.summaryGraphCardCol,
          component: <GridCard theme="shade" title="Card title" content={'Content'} />,
        },
        {
          id: '3',
          lg: 24,
          xl: 12,
          className: styles.summaryGraphCardCol,
          component: <GridCard theme="shade" title="Card title" content={'Content'} />,
        },
        {
          id: '4',
          lg: 24,
          xl: 12,
          className: styles.summaryGraphCardCol,
          component: <GridCard theme="shade" title="Card title" content={'Content'} />,
        },
      ]}
      gutter={[24, 24]}
    />
  );
};

export default SummaryTab;
