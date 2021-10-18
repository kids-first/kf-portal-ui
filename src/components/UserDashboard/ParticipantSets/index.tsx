/* eslint-disable react/prop-types */
import React, { Fragment, FunctionComponent, useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Link } from 'react-router-dom';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { Button, notification, Popconfirm, Result, Spin, Table } from 'antd';
import { AxiosResponse } from 'axios';
import { AlignType } from 'rc-table/lib/interface';

import participantMagenta from 'assets/icon-participants-magenta.svg';
import SaveSetModal from 'components/CohortBuilder/ParticipantsTableView/SaveSetModal';
import { withApi } from 'services/api';
import {
  createSetQueryInCohortBuilder,
  deleteUserSets,
  fetchSetsIfNeeded,
} from 'store/actionCreators/saveSets';
import { Api, ApiConfig } from 'store/apiTypes';
import { RootState } from 'store/rootState';
import {
  DeleteSetParams,
  DispatchSaveSets,
  SaveSetActionsTypes,
  SaveSetState,
  SetInfo,
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
  deleteSaveSet: (deleteSetParams: DeleteSetParams) => dispatch(deleteUserSets(deleteSetParams)),
  fetchUserSetsIfNeeded: (api: (config: ApiConfig) => Promise<AxiosResponse>) =>
    dispatch(fetchSetsIfNeeded(api)),
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
    key: '',
    name: '',
    count: 0,
    currentUser: '',
  } as SetInfo);

  useEffect(() => {
    fetchUserSetsIfNeeded(api);
  }, [fetchUserSetsIfNeeded, api]);

  const confirm = (setId: string) => {
    deleteSaveSet({ setIds: [setId], onFail: onDeleteFail } as DeleteSetParams);
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
      render: (count: number, record: SetInfo) => (
        <Link
          className={'classNames'}
          to={'/explore'}
          href={'#top'}
          onClick={() => {
            onClickParticipantsLink(record.key);
            const toTop = document.getElementById('main-page-container');
            toTop?.scrollTo(0, 0);
          }}
        >
          <Button className={'count-button'} type="text">
            {' '}
            <img src={participantMagenta} alt="Participants" />
            <div className={'save-sets-participants-count'}>{count}</div>
          </Button>
        </Link>
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
        <Table className="user-sets-table" columns={columns} dataSource={data} pagination={false} />
      ) : (
        <Result status="error" title="Failed to load user SaveSets" />
      )}
    </Fragment>
  );
};

const Connected = connector(ParticipantSets);

export default withApi(Connected);
