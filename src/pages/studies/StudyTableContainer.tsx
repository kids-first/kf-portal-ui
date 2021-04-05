import React, { FC } from 'react';
import { Table } from 'antd';
import { generateTableData } from 'store/graphql/studies/models';
import { StudiesResults } from 'store/graphql/studies/actions';
import { studiesColumns } from 'store/graphql/studies/tableColumns';
import { DispatchSaveSets } from 'store/saveSetTypes';
import { connect, ConnectedProps } from 'react-redux';
import { createQueryInCohortBuilder } from 'store/actionCreators/studyPage';
import { RootState } from 'store/rootState';
import { Sqon } from 'store/sqon';

interface StudyTableContainerState {
  currentVirtualStudy: Sqon[];
}

const mapDispatch = (dispatch: DispatchSaveSets) => ({
  onClickStudyLink: (sqons: Sqon[]) => dispatch(createQueryInCohortBuilder(sqons)),
});

const mapState = (state: RootState): StudyTableContainerState => ({
  currentVirtualStudy: state.currentVirtualStudy.sqons,
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = StudiesResults & PropsFromRedux;

const StudyTable: FC<Props> = (props) => {
  const tableData = generateTableData(props);

  if (props.loading) {
    return null;
  }

  return (
    <div>
      <Table
        columns={studiesColumns(props.currentVirtualStudy, props.onClickStudyLink)}
        dataSource={tableData}
      />
    </div>
  );
};

const Connected = connector(StudyTable);

export default Connected;
