import React from 'react';

import { computeStartStopPagination } from 'utils';

import styles from './TableTitle.module.scss';

type OwnProps = {
  currentPage: number;
  pageSize: number;
  total: number;
};

const TableTitle = ({ currentPage, pageSize, total }: OwnProps) => {
  const [start, stop] = computeStartStopPagination(currentPage, pageSize, total);

  return (
    <span className={styles.customTableTitle}>
      Showing <strong>{start.toLocaleString()}</strong> - <strong>{stop.toLocaleString()}</strong>{' '}
      out of <strong>{total.toLocaleString()}</strong>
    </span>
  );
};

export default TableTitle;
