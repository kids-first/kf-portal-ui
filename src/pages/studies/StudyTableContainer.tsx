import React, { ReactNode } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Table, Typography } from 'antd';

import { createQueryInCohortBuilder } from 'store/actionCreators/virtualStudies';
import { StudiesResults } from 'store/graphql/studies/actions';
import { generateTableData, StudiesResult } from 'store/graphql/studies/models';
import { studiesColumns, TStudyColumn } from 'store/graphql/studies/tableColumns';
import { RootState } from 'store/rootState';
import { Sqon } from 'store/sqon';
import { DispatchVirtualStudies } from 'store/virtualStudiesTypes';

import styles from './StudiesPageContainer.module.scss';

const { Text } = Typography;
type StudyTableContainerState = {
  currentVirtualStudy: Sqon[];
};

const mapDispatch = (dispatch: DispatchVirtualStudies) => ({
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

const getColumnTotal = (dataIndex: string, data: readonly StudiesRes[]) =>
  data.length ? data.reduce((sum, studyResult) => sum + studyResult[dataIndex], 0) : 0;

const renderColumnSummary = (columns: TStudyColumn[], data: readonly StudiesRes[]): ReactNode[] =>
  columns.map((column: TStudyColumn, index: number) =>
    column.children ? (
      renderColumnSummary(column.children, data)
    ) : (
      <Table.Summary.Cell
        key={column.dataIndex!}
        index={index}
        className={styles.studyTableFooterCell}
      >
        <strong>{column.summary && getColumnTotal(column?.dataIndex!, data)}</strong>
      </Table.Summary.Cell>
    ),
  );

const StudyTable = (props: Props) => {
  const tableData = generateTableData(props);
  const { total, currentVirtualStudy, onClickStudyLink } = props;
  const columns = studiesColumns(currentVirtualStudy, onClickStudyLink);

  return (
    <div>
      <div className={styles.tableHeader}>
        Showing <Text strong>{total}</Text>
        <span> studies </span>
      </div>
      <Table
        columns={columns}
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
