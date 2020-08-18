/* eslint-disable react/prop-types */
import * as React from 'react';
import { FunctionComponent, useEffect } from 'react';
import { Button, Result, Spin, Table } from 'antd';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from 'store/rootState';
import { DispatchSaveSets, SaveSetState } from 'store/saveSetTypes';
import {
  selectErrorUserSaveSets,
  selectIsLoadingSaveSets,
  selectUserSaveSets,
} from 'store/selectors/saveSetsSelectors';
import { getUserSaveSets } from 'store/actionCreators/saveSets';

import { AlignType } from 'rc-table/lib/interface';

import './ParticipantSets.css';
import { LoggedInUser } from 'store/userTypes';
import participantMagenta from 'assets/icon-participants-magenta.svg';

type OwnProps = {
  user: LoggedInUser;
};

const mapState = (state: RootState): SaveSetState => ({
  create: {
    isLoading: false,
    error: null,
    defaultTag: '',
  },
  userSets: {
    isLoading: selectIsLoadingSaveSets(state),
    sets: selectUserSaveSets(state),
    error: selectErrorUserSaveSets(state),
  },
});

const mapDispatch = (dispatch: DispatchSaveSets) => ({
  userSaveSets: (userId: string) => dispatch(getUserSaveSets(userId)),
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & OwnProps;

const align = 'right' as AlignType;

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    // eslint-disable-next-line react/display-name
    render: (name: string) => (
      <div className={'save-set-column-name'}>
        <div className={'save-set-table-name'}>{name} </div>
        <Button size={'small'} type={'text'}>
          <EditFilled className={'edit-icon'} />
        </Button>
      </div>
    ),
  },
  {
    title: 'Count',
    dataIndex: 'count',
    key: 'count',
    width: 80,
    align: align,
    // eslint-disable-next-line react/display-name
    render: (count: number) => (
      <Button className={'count-button'} type="text">
        <img src={participantMagenta} alt="" />
        <div className={'save-sets-participants-count'}>{count}</div>
      </Button>
    ),
  },
  {
    title: '',
    key: 'delete',
    dataIndex: 'delete',
    width: 40,
    // eslint-disable-next-line react/display-name
    render: () => (
      <Button size={'small'} type="text" block>
        <DeleteFilled />
      </Button>
    ),
  },
];

const ParticipantSets: FunctionComponent<Props> = (props) => {
  const { user, userSaveSets, userSets } = props;

  useEffect(() => {
    userSaveSets(user.egoId);
  }, [userSaveSets, user]);

  const data = userSets.sets.map((s) => ({
    key: s.setId,
    name: s.tag,
    count: s.size,
  }));

  return (
    <>
      {userSets.isLoading ? (
        <div className={'participant-set-spinner-container'}>
          <Spin size={'large'} />
        </div>
      ) : !userSets.error ? (
        <Table columns={columns} dataSource={data} pagination={false} scroll={{ y: 240 }} />
      ) : (
        <Result status="error" title="Failed to lead user SaveSets" />
      )}
    </>
  );
};

const Connected = connector(ParticipantSets);

export default Connected;
