import { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import {
  DownOutlined,
  ExperimentOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { ISqonGroupFilter } from '@ferlab/ui/core/data/sqon/types';
import { Button, Dropdown, Tooltip } from 'antd';
import { IBiospecimenEntity } from 'graphql/biospecimens/models';
import { IFileEntity } from 'graphql/files/models';
import { IQueryResults } from 'graphql/models';
import { IParticipantEntity } from 'graphql/participants/models';
import { IVariantEntity } from 'graphql/variants/models';
import { MenuClickEventHandler, MenuInfo } from 'rc-menu/lib/interface';
import CreateEditModal from 'views/Dashboard/components/DashboardCards/SavedSets/CreateEditModal';

import LineStyleIcon from 'components/Icons/LineStyleIcon';
import ListAddIcon from 'components/Icons/ListAddIcon';
import ListRemoveIcon from 'components/Icons/ListRemoveIcon';
import { SetType } from 'services/api/savedSet/models';
import { useSavedSet } from 'store/savedSet';
import { numberWithCommas } from 'utils/string';

import AddRemoveSaveSetModal from './AddRemoveSaveSetModal';

import styles from './index.module.css';

type Props = {
  idField: string;
  results: IQueryResults<
    IParticipantEntity[] | IFileEntity[] | IBiospecimenEntity[] | IVariantEntity[]
  >;
  sqon?: ISqonGroupFilter;
  selectedAllResults: boolean;
  selectedKeys?: string[];
  type: SetType;
};

export enum SetActionType {
  RENAME_TAG = 'RENAME_TAG',
  ADD_IDS = 'ADD_IDS',
  REMOVE_IDS = 'REMOVE_IDS',
  CREATE_SET = 'CREATE_SET',
  HIDDEN = 'HIDDEN',
  UPDATE_SET = 'UPDATE_SET',
  REMOVE_SET = 'REMOVE_SET',
}

type ModalState = {
  showModalSave: boolean;
  actionType: SetActionType;
  showModalAddDelete: boolean;
};

const modals = {
  create: {
    showModalSave: true,
    showModalAddDelete: false,
    actionType: SetActionType.CREATE_SET,
  },
  add_ids: {
    showModalSave: false,
    showModalAddDelete: true,
    actionType: SetActionType.ADD_IDS,
  },
  remove_ids: {
    showModalSave: false,
    showModalAddDelete: true,
    actionType: SetActionType.REMOVE_IDS,
  },
  hideAll: {
    showModalSave: false,
    showModalAddDelete: false,
    actionType: SetActionType.HIDDEN,
  },
};

const ROW_SELECTION_LIMIT = 10000;
const exceedLimit = (participantCount: number) => participantCount > ROW_SELECTION_LIMIT;

export const itemIcon = (type: string) => {
  switch (type) {
    case SetType.BIOSPECIMEN:
      return <ExperimentOutlined width="14px" height="14px" />;
    case SetType.FILE:
      return <FileTextOutlined width="14px" height="14px" />;
    case SetType.VARIANT:
      return <LineStyleIcon width="14px" height="14px" />;
    default:
      return <UserOutlined width="14px" height="14px" />;
  }
};

export const singularizeSetTypeIfNeeded = (type: string) =>
  type === SetType.VARIANT ? type.slice(0, -1) : type;

const getSetCount = (selected: string[], total: number, allSelected: boolean) => {
  if (allSelected) {
    return total;
  } else {
    return selected.length === 0 ? total : selected.length;
  }
};

const SetsManagementDropdown = ({
  idField,
  results,
  sqon,
  type,
  selectedKeys = [],
  selectedAllResults,
}: Props) => {
  const [isEditDisabled, setIsEditDisabled] = useState(true);
  const [modal, setModal] = useState<ModalState>(modals.hideAll);
  const { savedSets, isLoading, fetchingError } = useSavedSet();

  const disabledDropdown = selectedKeys.length === 0 && !selectedAllResults;

  useEffect(() => {
    if (savedSets && !isLoading && !fetchingError && sqon) {
      setIsEditDisabled(!(savedSets.length > 0 && sqon.content.length > 0));
    }
  }, [fetchingError, isLoading, savedSets, sqon]);

  const onClick: MenuClickEventHandler = (e: MenuInfo) => {
    const key = e.key as string;
    // @ts-ignore
    const m = modals[key];
    return setModal(m);
  };

  return (
    <div id={`${type}-set-dropdown-container`}>
      {modal.showModalSave && sqon && (
        <CreateEditModal
          title={intl.get('screen.dataExploration.setsManagementDropdown.newTitle', {
            filter: singularizeSetTypeIfNeeded(type).toLocaleLowerCase(),
          })}
          idField={idField}
          sqon={sqon}
          setType={type}
          hideModalCb={() => setModal(modals.hideAll)}
          saveSetActionType={SetActionType.CREATE_SET}
          hasSelectedKeys={selectedKeys?.length > 0 && !selectedAllResults}
        />
      )}
      {modal.showModalAddDelete && (
        <AddRemoveSaveSetModal
          idField={idField}
          sqon={sqon}
          setActionType={modal.actionType}
          hideModalCb={() => {
            setModal(modals.hideAll);
            // clearQueryCache();
          }}
          userSets={savedSets}
          type={type}
        />
      )}
      <Tooltip
        title={
          disabledDropdown ? intl.get('screen.dataExploration.itemSelectionTooltip') : undefined
        }
      >
        <div>
          <Dropdown
            menu={{
              className: styles.saveSetOptionMenu,
              onClick: (e: MenuInfo) => onClick(e),
              items: [
                {
                  key: 'participant-count',
                  className: `${
                    exceedLimit(getSetCount(selectedKeys || [], results.total, selectedAllResults))
                      ? styles.saveSetOptionMenuInfoOver
                      : styles.saveSetOptionMenuInfo
                  }`,
                  disabled: true,
                  icon: itemIcon(type),
                  label: (
                    <>
                      <span>
                        {intl.get('screen.dataExploration.setsManagementDropdown.selected', {
                          count: getSetCount(selectedKeys || [], results.total, selectedAllResults),
                          type: singularizeSetTypeIfNeeded(type),
                        })}
                      </span>
                      <Tooltip
                        arrowPointAtCenter
                        placement="topRight"
                        title={`Max. ${numberWithCommas(
                          ROW_SELECTION_LIMIT,
                        )} items at a time. The first 10,000 will be processed.`}
                      >
                        <InfoCircleOutlined className={styles.infoCircle} />
                      </Tooltip>
                    </>
                  ),
                },
                {
                  type: 'divider',
                },
                {
                  key: 'create',
                  icon: <PlusOutlined />,
                  label: intl.get('screen.dataExploration.setsManagementDropdown.create'),
                },
                {
                  key: 'add_ids',
                  icon: <ListAddIcon />,
                  label: intl.get('screen.dataExploration.setsManagementDropdown.add'),
                  disabled: isEditDisabled,
                },
                {
                  key: 'remove_ids',
                  icon: <ListRemoveIcon />,
                  label: intl.get('screen.dataExploration.setsManagementDropdown.remove'),
                  disabled: isEditDisabled,
                },
              ],
            }}
            placement="bottomLeft"
            trigger={['click']}
            disabled={selectedKeys.length === 0 && !selectedAllResults}
            getPopupContainer={() =>
              document.getElementById(`${type}-set-dropdown-container`) as HTMLElement
            }
          >
            <Button className={'save-set-btn'} onClick={(e) => e.preventDefault()}>
              {intl.get('screen.dataExploration.setsManagementDropdown.saveSet', {
                type: singularizeSetTypeIfNeeded(type),
              })}
              <DownOutlined />
            </Button>
          </Dropdown>
        </div>
      </Tooltip>
    </div>
  );
};

export default SetsManagementDropdown;
