/* eslint-disable react/prop-types */
import React, { Fragment, FunctionComponent, useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Link } from 'react-router-dom';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { Button, notification, Popconfirm, Result, Spin, Table } from 'antd';
import { AlignType } from 'rc-table/lib/interface';

import participantMagenta from 'assets/icon-participants-magenta.svg';
import SaveSetModal from 'components/CohortBuilder/ParticipantsTableView/SaveSetModal';
import { withApi } from 'services/api';
import {
  createSetQueryInCohortBuilder,
  deleteUserSets,
  fetchSetsIfNeeded,
} from 'store/actionCreators/saveSets';
import { Api, ApiFunction } from 'store/apiTypes';
import { RootState } from 'store/rootState';
import {
  DeleteSetParams,
  DispatchSaveSets,
  SaveSetActionsTypes,
  SaveSetState,
  UserSet,
} from 'store/saveSetTypes';
import { selectUserSets } from 'store/selectors/saveSetsSelectors';
import { User } from 'store/userTypes';

import './ParticipantSets.scss';

type OwnProps = {
  user: User;
};

const mapState = (state: RootState): SaveSetState => ({
  create: {
    isLoading: false,
    error: null,
  },
  userSets: selectUserSets(state),
});

const mapDispatch = (dispatch: DispatchSaveSets) => ({
  onClickParticipantsLink: (setId: string) => dispatch(createSetQueryInCohortBuilder(setId)),
  deleteSaveSet: (api: ApiFunction, deleteSetParams: DeleteSetParams) =>
    dispatch(deleteUserSets(api, deleteSetParams)),
  fetchUserSetsIfNeeded: (api: ApiFunction) => dispatch(fetchSetsIfNeeded(api)),
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & OwnProps & Api;

const align = 'right' as AlignType;

const onDeleteFail = () => {
  notification.error({
    message: 'Error',
    description: `Deleting this Saved Set has failed`,
    duration: 10,
  });
};

const ParticipantSets: FunctionComponent<Props> = (props) => {
  const {
    user,
    userSets,
    deleteSaveSet,
    onClickParticipantsLink,
    fetchUserSetsIfNeeded,
    api,
  } = props;
  const [showModal, setShowModal] = useState(false);
  const [editSet, setEditSet] = useState({
    setId: '',
    tag: '',
    size: 0,
  } as UserSet);

  useEffect(() => {
    fetchUserSetsIfNeeded(api);
  }, [fetchUserSetsIfNeeded, api]);

  const confirm = (setId: string) => {
    deleteSaveSet(api, { setId, onFail: onDeleteFail } as DeleteSetParams);
  };

  const onEditClick = (record: UserSet) => {
    setEditSet(record);
    setShowModal(true);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'tag',
      key: 'tag',
      // eslint-disable-next-line react/display-name
      render: (tag: string, record: UserSet) => (
        <div className={'save-set-column-name'}>
          <div className={'save-set-table-name'}>
            {tag}{' '}
            <Button size={'small'} type={'text'} onClick={() => onEditClick(record)}>
              <EditFilled className={'edit-icon'} />
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: 'Count',
      dataIndex: 'size',
      key: 'size',
      width: 80,
      align: align,
      // eslint-disable-next-line react/display-name
      render: (size: number, record: UserSet) => (
        <Link
          className={'classNames'}
          to={'/explore'}
          href={'#top'}
          onClick={() => {
            onClickParticipantsLink(record.setId);
            const toTop = document.getElementById('main-page-container');
            toTop?.scrollTo(0, 0);
          }}
        >
          <Button className={'count-button'} type="text">
            {' '}
            <img src={participantMagenta} alt="Participants" />
            <div className={'save-sets-participants-count'}>{size}</div>
          </Button>
        </Link>
      ),
    },
    {
      title: '',
      key: 'delete',
      dataIndex: 'setId',
      width: 40,
      // eslint-disable-next-line react/display-name
      render: (setId: string) => (
        <Popconfirm
          title="Permanently delete this set?"
          onConfirm={() => confirm(setId)}
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

  const data: UserSet[] = userSets.sets;

  return (
    <Fragment>
      {showModal && (
        <SaveSetModal
          title={'Edit Set Name'}
          user={user}
          hideModalCb={() => {
            setShowModal(false);
            setEditSet({ setId: '', tag: '', size: 0 });
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
        <Table
          className="user-sets-table"
          columns={columns}
          dataSource={data}
          pagination={false}
          rowKey="setId"
        />
      ) : (
        <Result status="error" title="Failed to load user SaveSets" />
      )}
    </Fragment>
  );
};

const Connected = connector(ParticipantSets);

export default withApi(Connected);
