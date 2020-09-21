/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { selectUserSets } from 'store/selectors/saveSetsSelectors';
import { RootState } from 'store/rootState';
import { SaveSetActionsTypes, SetSubActionTypes } from 'store/saveSetTypes';

import { Button, Dropdown, Menu } from 'antd';
import { MenuClickEventHandler } from 'rc-menu/lib/interface';
import {
  DownOutlined,
  PlusOutlined,
  UsergroupAddOutlined,
  UsergroupDeleteOutlined,
} from '@ant-design/icons';
import { ApiContext } from 'services/api';

import { Sqon } from 'store/sqon';
import './ParticipantSetDropdown.css';
import SaveSetModal from './SaveSetModal';
import AddRemoveSaveSetModal from './AddRemoveSaveSetModal';

type ParticipantSetDropdownProps = {
  sqon: Sqon;
};

const mapStateToProps = (state: RootState) => ({
  loggedInUser: state.user.loggedInUser,
  userSets: selectUserSets(state),
});

const connector = connect(mapStateToProps, () => ({}));

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = ParticipantSetDropdownProps & PropsFromRedux;
type ModalState = {
  showModalSave: boolean;
  actionType?: SetSubActionTypes;
  showModalAddDelete: boolean;
};

enum ActionType {
  save,
  add,
  delete,
}
const modals = {
  [ActionType.save]: {
    showModalSave: true,
    showModalAddDelete: false,
  },
  [ActionType.add]: {
    showModalSave: false,
    showModalAddDelete: true,
    actionType: SetSubActionTypes.ADD_IDS,
  },
  [ActionType.delete]: {
    showModalSave: false,

    showModalAddDelete: true,
    actionType: SetSubActionTypes.REMOVE_IDS,
  },
  hideAll: {
    showModalSave: false,
    showModalAddDelete: false,
  },
};

const ParticipantSetDropdown = ({ sqon, userSets, loggedInUser }: Props): JSX.Element => {
  const [isEditDisabled, setIsEditDisabled] = useState(true);
  const [modal, setModal] = useState<ModalState>(modals.hideAll);
  const api = useContext(ApiContext);

  const onClick: MenuClickEventHandler = (e) => setModal(modals[e.key as ActionType]);

  useEffect(() => {
    if (userSets && sqon) {
      setIsEditDisabled(!(userSets.length > 0 && sqon.content.length > 0));
    }
  }, [userSets, sqon]);

  const menu = () => (
    <Menu onClick={onClick}>
      <Menu.Item key={ActionType.save} icon={<PlusOutlined />}>
        Save as new set
      </Menu.Item>
      <Menu.Item key={ActionType.add} icon={<UsergroupAddOutlined />} disabled={isEditDisabled}>
        Add to existing set
      </Menu.Item>
      <Menu.Item
        key={ActionType.delete}
        icon={<UsergroupDeleteOutlined />}
        disabled={isEditDisabled}
      >
        Remove from existing set
      </Menu.Item>
    </Menu>
  );

  return (
    <div id={'participant-set-dropdown-container'}>
      {modal.showModalSave && (
        <SaveSetModal
          title={'Save Participant Set'}
          api={api}
          sqon={sqon}
          user={loggedInUser}
          hideModalCb={() => setModal(modals.hideAll)}
          saveSetActionType={SaveSetActionsTypes.CREATE}
        />
      )}
      {modal.showModalAddDelete && (
        <AddRemoveSaveSetModal
          api={api}
          sqon={sqon}
          user={loggedInUser}
          subActionType={modal.actionType}
          hideModalCb={() => setModal(modals.hideAll)}
          saveSetActionType={SaveSetActionsTypes.EDIT}
        />
      )}
      <Dropdown
        overlay={menu()}
        placement="bottomLeft"
        trigger={['click']}
        getPopupContainer={() =>
          document.getElementById('participant-set-dropdown-container') as HTMLElement
        }
      >
        <Button className={'save-set-btn'} onClick={(e) => e.preventDefault()}>
          Save participants set
          <DownOutlined />
        </Button>
      </Dropdown>
    </div>
  );
};

export default connector(ParticipantSetDropdown);
