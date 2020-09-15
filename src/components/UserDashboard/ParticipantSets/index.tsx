/* eslint-disable react/prop-types */
import React, { Fragment, FunctionComponent, useEffect, useState } from 'react';
import { Button, notification, Popconfirm, Result, Spin, Table } from 'antd';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from 'store/rootState';
import {
  DeleteSetParams,
  DispatchSaveSets,
  SaveSetActionsTypes,
  SaveSetState,
} from 'store/saveSetTypes';
import {
  selectErrorUserSets,
  selectIsDeletingSets,
  selectIsLoadingSets,
  selectUserSets,
} from 'store/selectors/saveSetsSelectors';
import { deleteUserSets, getUserSets } from 'store/actionCreators/saveSets';

import { AlignType } from 'rc-table/lib/interface';

import './ParticipantSets.css';
import { LoggedInUser } from 'store/userTypes';
import participantMagenta from 'assets/icon-participants-magenta.svg';
import SaveSetModal from '../../CohortBuilder/ParticipantsTableView/SaveSetModal';

type OwnProps = {
  user: LoggedInUser;
};

export type SetInfo = {
  key: string;
  name: string;
  count?: number;
  currentUser: string;
};

const mapState = (state: RootState): SaveSetState => ({
  create: {
    isLoading: false,
    error: null,
  },
  userSets: {
    isLoading: selectIsLoadingSets(state),
    sets: selectUserSets(state),
    error: selectErrorUserSets(state),
    isDeleting: selectIsDeletingSets(state),
    isEditing: false, //TODO
  },
});

const mapDispatch = (dispatch: DispatchSaveSets) => ({
  userSaveSets: (userId: string) => dispatch(getUserSets(userId)),
  deleteSaveSet: (deleteSetParams: DeleteSetParams) => dispatch(deleteUserSets(deleteSetParams)),
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & OwnProps;

const align = 'right' as AlignType;

const onDeleteFail = () => {
  notification.error({
    message: 'Error',
    description: `Deleting this Saved Set has failed`,
    duration: 10,
  });
};

const ParticipantSets: FunctionComponent<Props> = (props) => {
  const { user, userSaveSets, userSets, deleteSaveSet } = props;
  const [showModal, setShowModal] = useState(false);
  const [editSet, setEditSet] = useState({
    key: '',
    name: '',
    count: 0,
    currentUser: '',
  } as SetInfo);

  const confirm = (setId: string, userId: string) => {
    deleteSaveSet({ userId: userId, setIds: [setId], onFail: onDeleteFail } as DeleteSetParams);
  };

  const onEditClick = (record: SetInfo) => {
    setEditSet(record);
    setShowModal(true);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      // eslint-disable-next-line react/display-name
      render: (name: string, record: SetInfo) => (
        <div className={'save-set-column-name'}>
          <div className={'save-set-table-name'}>
            {name}{' '}
            <Button size={'small'} type={'text'} onClick={() => onEditClick(record)}>
              <EditFilled className={'edit-icon'} />
            </Button>
          </div>
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
        // <Button className={'count-button'} type="text"> todo reactivate button and delete div on task 2614 completion
        <div className={'count-button'}>
          <img src={participantMagenta} alt="Participants" />
          <div className={'save-sets-participants-count'}>{count}</div>
        </div>
        // </Button>
      ),
    },
    {
      title: '',
      key: 'delete',
      dataIndex: 'key',
      width: 40,
      // eslint-disable-next-line react/display-name
      render: (setId: string) => (
        <Popconfirm
          title="Permanently delete this set?"
          onConfirm={() => confirm(setId, user.egoId)}
          okText="Delete"
          cancelText="Cancel"
        >
          <Button size={'small'} type="text">
            <DeleteFilled />
          </Button>
        </Popconfirm>
      ),
    },
  ];

  useEffect(() => {
    userSaveSets(user.egoId);
  }, [userSaveSets, user]);

  const data: SetInfo[] = userSets.sets.map((s) => ({
    key: s.setId,
    name: s.tag,
    count: s.size,
    currentUser: user.egoId,
  }));

  return (
    <Fragment>
      {showModal && (
        <SaveSetModal
          title={'Edit Set Name'}
          user={user}
          hideModalCb={() => {
            setShowModal(false);
            setEditSet({ key: '', name: '', count: 0, currentUser: '' });
          }}
          onFail={onDeleteFail}
          setToRename={editSet}
          saveSetActionType={SaveSetActionsTypes.EDIT}
        />
      )}
      {userSets.isLoading ? (
        <div className={'participant-set-spinner-container'}>
          <Spin size={'large'} />
        </div>
      ) : !userSets.error ? (
        <Table columns={columns} dataSource={data} pagination={false} scroll={{ y: 240 }} />
      ) : (
        <Result status="error" title="Failed to load user SaveSets" />
      )}
    </Fragment>
  );
};

const Connected = connector(ParticipantSets);

export default Connected;
