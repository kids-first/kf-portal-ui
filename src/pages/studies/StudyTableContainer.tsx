import React, { FC } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Table } from 'antd';
import { Typography } from 'antd';
import { TablePaginationConfig } from 'antd/lib/table';

import { createQueryInCohortBuilder, DispatchStoryPage } from 'store/actionCreators/studyPage';
import { StudiesResults } from 'store/graphql/studies/actions';
import { generateTableData } from 'store/graphql/studies/models';
import { studiesColumns } from 'store/graphql/studies/tableColumns';
import { RootState } from 'store/rootState';
import { Sqon } from 'store/sqon';

import styles from './StudiesPageContainer.module.scss';

const { Text } = Typography;
type StudyTableContainerState = {
  currentVirtualStudy: Sqon[];
};

const mapDispatch = (dispatch: DispatchStoryPage) => ({
  onClickStudyLink: (sqons: Sqon[]) => dispatch(createQueryInCohortBuilder(sqons)),
});

const mapState = (state: RootState): StudyTableContainerState => ({
  currentVirtualStudy: state.currentVirtualStudy.sqons,
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
export type PaginationType = {
  pagination: TablePaginationConfig;
};

type Props = StudiesResults & PropsFromRedux & PaginationType;

const StudyTable: FC<Props> = (props) => {
  const { loading, pagination } = props;
  const { current: currentPage, total: itemTotal = 0, pageSize: itemPerPage = 10 } = pagination;

  if (loading) {
    return null;
  }

  const tableData = generateTableData(props);
  const pageRange = `${currentPage}-${itemTotal > itemPerPage ? itemPerPage : itemTotal}`;

  return (
    <div>
      <div className={styles.tableHeader}>
        Showing <Text strong>{pageRange}</Text>
        <span> out of </span>
        <Text strong>{itemTotal}</Text>
      </div>
      <Table
        columns={studiesColumns(props.currentVirtualStudy, props.onClickStudyLink)}
        dataSource={tableData}
        pagination={pagination}
      />
    </div>
  );
};

const Connected = connector(StudyTable);

export default Connected;
