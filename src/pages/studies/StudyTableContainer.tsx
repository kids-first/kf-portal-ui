import React, { ReactNode } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Table, Typography } from 'antd';

import { createQueryInCohortBuilder, DispatchStoryPage } from 'store/actionCreators/studyPage';
import { StudiesResults } from 'store/graphql/studies/actions';
import { generateTableData, StudiesResult } from 'store/graphql/studies/models';
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

type Props = StudiesResults & PropsFromRedux & { total: number };

type StudiesRes = StudiesResult & {
  [dataIndex: string]: any;
};

const StudyTable = (props: Props) => {
  const tableData = generateTableData(props);
  const { total, currentVirtualStudy, onClickStudyLink } = props;
  const columns = studiesColumns(currentVirtualStudy, onClickStudyLink);

  const renderColumnSummary = (columns: any, data: any): ReactNode[] =>
    columns.map((column: any) =>
      column.children ? (
        renderColumnSummary(column.children, data)
      ) : (
        <Table.Summary.Cell
          key={column.dataIndex}
          index={column.dataIndex}
          className={styles.studyTableFooterCell}
        >
          <strong>{column.summary && getColumnTotal(column.dataIndex, data)}</strong>
        </Table.Summary.Cell>
      ),
    );

  const getColumnTotal = (dataIndex: string, data: StudiesRes[]) =>
    data.length ? data.map((study: StudiesRes) => study[dataIndex]).reduce((a, b) => a + b) : 0;

  return (
    <div>
      <div className={styles.tableHeader}>
        Showing <Text strong>{total}</Text>
        <span> studies </span>
      </div>
      <Table
        columns={columns}
        scroll={{ x: 1500 }}
        dataSource={tableData || []}
        pagination={false}
        summary={(data: readonly StudiesRes[]) => (
          <Table.Summary.Row className={styles.studyTableFooter}>
            {renderColumnSummary(columns, data)}
          </Table.Summary.Row>
        )}
      />
    </div>
  );
};

export default connector(StudyTable);
