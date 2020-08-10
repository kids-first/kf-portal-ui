import * as React from 'react';
import { FunctionComponent } from 'react';
import { Table } from 'antd';
import { DeleteFilled } from '@ant-design/icons';
import DemographicIcon from '../../../icons/DemographicIcon';
import { connect } from 'react-redux';
import { RootState } from '../../../store/rootState';
import { DispatchSaveSets, SaveSetParams, SaveSetState } from '../../../store/saveSetTypes';
import {
  selectErrorUserSaveSets,
  selectIsLoadingSaveSets,
  selectUserSaveSets,
} from '../../../store/selectors/saveSetsSelectors';
import {
  createSaveSetIfUnique,
  reInitializeSaveSetsState,
} from '../../../store/actionCreators/saveSets';

type Props = {};

const mapState = (state: RootState): SaveSetState => ({
  create: {
    isLoading: false,
    error: null,
  },
  userSets: {
    isLoading: selectIsLoadingSaveSets(state),
    sets: selectUserSaveSets(state),
    error: selectErrorUserSaveSets(state),
  },
});

const mapDispatch = (dispatch: DispatchSaveSets) => ({
  onCreateSet: (params: SaveSetParams) => dispatch(createSaveSetIfUnique(params)),
  reInitializeState: () => dispatch(reInitializeSaveSetsState()),
});

const connector = connect(mapState, mapDispatch);

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Count',
    dataIndex: 'count',
    key: 'count',
    // eslint-disable-next-line react/display-name
    render: (count: number) => (
      <div>
        <DemographicIcon width="14px" height="17px" />
        {count}
      </div>
    ),
  },
  {
    title: '',
    key: 'delete',
    dataIndex: 'delete',
    // eslint-disable-next-line react/display-name
    render: () => (
      <a>
        <DeleteFilled />
      </a>
    ),
  },
];

const data = [
  {
    key: '1',
    name: 'Save Set1 ',
    count: 32,
  },
  {
    key: '2',
    name: 'Save Set2',
    count: 1255,
  },
  {
    key: '3',
    name: 'Save Set 3',
    count: 2000,
  },
  {
    key: '4',
    name: 'Save Set 4',
    count: 2000,
  },
  {
    key: '5',
    name: 'Save Set 5',
    count: 2000,
  },
  {
    key: '6',
    name: 'Save Set 6',
    count: 2000,
  },
  {
    key: '7',
    name: 'Save Set 7',
    count: 2000,
  },
  {
    key: '8',
    name: 'Save Set 8',
    count: 2000,
  },
  {
    key: '9',
    name: 'Save Set 9',
    count: 2000,
  },
];

const ParticipantSets: FunctionComponent<Props> = () => (
  <>
    <Table columns={columns} dataSource={data} pagination={false} scroll={{ y: 240 }} />
  </>
);

const Connected = connector(ParticipantSets);

export default Connected;
