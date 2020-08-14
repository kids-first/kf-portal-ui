/* eslint-disable react/prop-types */
import * as React from 'react';
import { FunctionComponent, useEffect } from 'react';
import { Button, Table } from 'antd';
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

type OwnProps = {
  user: LoggedInUser;
};

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
  userSaveSets: (userId: string) => dispatch(getUserSaveSets(userId)),
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & OwnProps;

const test = 'right' as AlignType;

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    // eslint-disable-next-line react/display-name
    render: (name: string) => (
      <div style={{ display: 'inline-flex', alignItems: 'center' }}>
        <div className={'save-set-table-name'}>{name} </div>
        <Button size={'small'} type={'text'}>
          <EditFilled style={{ paddingLeft: 2.75 }} />
        </Button>
      </div>
    ),
  },
  {
    title: 'Count',
    dataIndex: 'count',
    key: 'count',
    width: 80,
    align: test,
    // eslint-disable-next-line react/display-name
    render: (count: number) => (
      <Button
        className={'count-button'}
        type="text"
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.6">
            <path
              d="M6.21688 1.87316C5.59104 2.44276 5.49155 3.77324 6.05106 4.38771C7.276 5.73208
                9.67773 3.19082 8.15646 1.66798C7.71997 1.22983 7.01389 1.14861 6.21688
                1.87316ZM5.7909 12.0203C5.87697 11.5264 5.96412 11.0263 5.96759 10.5731C5.98149 
                8.90277 5.21551 7.25063 4.04192 6.09969C2.57093 4.65593 1.58991 2.9386 4.8154
                4.62708C7.00051 5.77144 7.30031 5.59778 9.05995 4.57851C9.23439 4.47747 9.42317
                4.36812 9.62956 4.25091C11.8516 2.98883 11.5616 3.81383 10.5464 5.25224C9.79752
                6.31342 9.31824 7.2346 9.76757 8.21029C10.2321 9.21789 11.2238 9.3837 11.9228
                9.50058C11.937 9.50295 11.951 9.5053 11.965 9.50764C13.3333 9.73718 14.6127 10.8296
                10.8566 11.1726C10.5503 11.2005 10.2878 11.213 10.0582 11.2239C9.0756 11.2707
                8.69675 11.2887 8.06977 12.3663C7.95923 12.5561 7.84867 12.7571 7.73807
                12.9582C7.1711 13.9891 6.60326 15.0215 6.03392 14.5485C5.43677 14.0524 5.6115
                13.0497 5.7909 12.0203Z"
              fill="#A6278F"
            />
          </g>
        </svg>
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
      <Table columns={columns} dataSource={data} pagination={false} scroll={{ y: 240 }} />
    </>
  );
};

const Connected = connector(ParticipantSets);

export default Connected;
