import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Table, Typography } from 'antd';

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

type Props = StudiesResults & PropsFromRedux & { total: number };

const StudyTable = (props: Props) => {
  const tableData = generateTableData(props);
  const { total } = props;

  return (
    <div>
      <div className={styles.tableHeader}>
        Showing <Text strong>{total}</Text>
        <span> studies </span>
      </div>
      <Table
        columns={studiesColumns(props.currentVirtualStudy, props.onClickStudyLink)}
        dataSource={tableData || []}
        pagination={false}
      />
    </div>
  );
};

const Connected = connector(StudyTable);

export default Connected;
