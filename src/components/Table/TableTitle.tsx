import React from 'react';

import { computeStartStopPagination } from '../../utils';

type OwnProps = {
  currentPage: number;
  pageSize: number;
  total: number;
};

import styles from './TableTitle.module.scss';

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
