/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  DownOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  UsergroupAddOutlined,
  UsergroupDeleteOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Menu, Tooltip } from 'antd';
import { MenuClickEventHandler } from 'rc-menu/lib/interface';

import useQueryResolverCache from 'hooks/useQueryResolverCache';
import DemographicIcon from 'icons/DemographicIcon';
import { ApiContext } from 'services/api';
import { fetchSetsIfNeeded } from 'store/actionCreators/saveSets';
import { RootState } from 'store/rootState';
import { DispatchSaveSets, SaveSetActionsTypes, SetSubActionTypes } from 'store/saveSetTypes';
import { selectCurrentSelectionSqons } from 'store/selectors/currentStudy';
import { selectSets } from 'store/selectors/saveSetsSelectors';
import { Sqon, SqonFilters } from 'store/sqon';
import { User } from 'store/userTypes';

import AddRemoveSaveSetModal from './AddRemoveSaveSetModal';
import SaveSetModal from './SaveSetModal';

import './ParticipantSetDropdown.scss';

type ParticipantSetDropdownProps = {
  user: User;
  sqon: Sqon;
  participantCount: number;
};

const ROW_SELECTION_LIMIT = 10000;

const mapStateToProps = (state: RootState) => ({
  userSets: selectSets(state),
  selectionSqon: selectCurrentSelectionSqons(state),
});

const mapDispatch = (dispatch: DispatchSaveSets) => ({
  fetchUserSetsIfNeeded: (userId: string) => dispatch(fetchSetsIfNeeded(userId)),
});

const connector = connect(mapStateToProps, mapDispatch);

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

const ParticipantSetDropdown = ({
  sqon,
  userSets,
  user,
  participantCount,
  selectionSqon,
  fetchUserSetsIfNeeded,
}: Props): JSX.Element => {
  const [isEditDisabled, setIsEditDisabled] = useState(true);
  const [modal, setModal] = useState<ModalState>(modals.hideAll);
  const api = useContext(ApiContext);
  const { clearQueryCache } = useQueryResolverCache();

  const onClick: MenuClickEventHandler = (e) => setModal(modals[e.key as ActionType]);

  useEffect(() => {
    fetchUserSetsIfNeeded(user.egoId);
  }, [user, fetchUserSetsIfNeeded]);

  useEffect(() => {
    if (userSets && (sqon || selectionSqon)) {
      setIsEditDisabled(
        !(userSets.length > 0 && (sqon.content.length > 0 || selectionSqon?.content.length > 0)),
      );
    }
  }, [userSets, sqon, selectionSqon]);

  const getSelectecParticipantCount = () => {
    if (selectionSqon) {
      let sqonFilter = selectionSqon.content[0] as SqonFilters;
      return sqonFilter.content.value.length;
    }

    return participantCount;
  };

  const exceedLimit = () => getSelectecParticipantCount() > ROW_SELECTION_LIMIT;

  const menu = () => (
    <Menu className="save-set-option-menu" onClick={onClick}>
      <Menu.Item
        id="participant-count"
        key="participant-count"
        className={'save-set-option' + (exceedLimit() ? ' over' : '')}
        disabled
        icon={
          <DemographicIcon
            fill={exceedLimit() ? '#dd1f2a' : '#a9adc0'}
            width="14px"
            height="14px"
          />
        }
      >
        <span>{getSelectecParticipantCount()} participants selected</span>
        <Tooltip
          arrowPointAtCenter
          placement="topRight"
          title={'Max. 10,000 participants at a time. The first 10,000 will be processed.'}
        >
          <InfoCircleOutlined id="info" />
        </Tooltip>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key={ActionType.save} className="save-set-option" icon={<PlusOutlined />}>
        Save as new set
      </Menu.Item>
      <Menu.Item
        key={ActionType.add}
        className="save-set-option"
        icon={<UsergroupAddOutlined />}
        disabled={isEditDisabled}
      >
        Add to existing set
      </Menu.Item>
      <Menu.Item
        key={ActionType.delete}
        className="save-set-option"
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
          sqon={selectionSqon || sqon}
          user={user}
          hideModalCb={() => setModal(modals.hideAll)}
          saveSetActionType={SaveSetActionsTypes.CREATE}
        />
      )}
      {modal.showModalAddDelete && (
        <AddRemoveSaveSetModal
          api={api}
          sqon={selectionSqon || sqon}
          user={user}
          subActionType={modal.actionType}
          hideModalCb={() => {
            setModal(modals.hideAll);
            clearQueryCache();
          }}
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
