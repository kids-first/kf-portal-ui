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
import { IQueryResults } from '@ferlab/ui/core/graphql/types';
import { Button, Dropdown, Menu, Tooltip } from 'antd';
import { IBiospecimenEntity } from 'graphql/biospecimens/models';
import { INDEXES } from 'graphql/constants';
import { IFileEntity } from 'graphql/files/models';
import { IParticipantEntity } from 'graphql/participants/models';
import { MenuClickEventHandler } from 'rc-menu/lib/interface';
import CreateEditModal from 'views/Dashboard/components/DashboardCards/SavedSets/CreateEditModal';

import ListAddIcon from 'components/Icons/ListAddIcon';
import ListRemoveIcon from 'components/Icons/ListRemoveIcon';
import { SetType } from 'services/api/savedSet/models';
import { useSavedSet } from 'store/savedSet';
import { numberWithCommas } from 'utils/string';

import AddRemoveSaveSetModal from './AddRemoveSaveSetModal';

import styles from './index.module.scss';
import { IVariantEntity } from 'graphql/variants/models';
import LineStyleIcon from 'components/Icons/LineStyleIcon';

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
const exceedLimit = (count: number) => count > ROW_SELECTION_LIMIT;

const itemIcon = (type: string) => {
  switch (type) {
    case INDEXES.BIOSPECIMENS:
      return <ExperimentOutlined width="14px" height="14px" />;
    case INDEXES.FILES:
      return <FileTextOutlined width="14px" height="14px" />;
    case SetType.VARIANT:
      return <LineStyleIcon width="14px" height="14px" />;
    default:
      return <UserOutlined width="14px" height="14px" />;
  }
};

export const singuralizeSetTypeIfNeeded = (type: string) =>
  type === SetType.FILES || type === SetType.VARIANT ? type.slice(0, -1) : type;

const menu = (
  count: number,
  onClick: MenuClickEventHandler,
  isEditDisabled: boolean,
  type: string,
) => (
  <Menu
    className={styles.saveSetOptionMenu}
    onClick={onClick}
    items={[
      {
        key: 'participant-count',
        className: `${
          exceedLimit(count) ? styles.saveSetOptionMenuInfoOver : styles.saveSetOptionMenuInfo
        }`,
        disabled: true,
        icon: itemIcon(type),
        label: (
          <>
            <span>
              {intl.get('screen.dataExploration.setsManagementDropdown.selected', {
                count,
                type: singuralizeSetTypeIfNeeded(type),
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
    ]}
  />
);

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

  useEffect(() => {
    if (savedSets && !isLoading && !fetchingError && sqon) {
      setIsEditDisabled(!(savedSets.length > 0 && sqon.content.length > 0));
    }
  }, [fetchingError, isLoading, savedSets, sqon]);

  const onClick: MenuClickEventHandler = (e) => {
    const key = e.key as string;
    // @ts-ignore
    const m = modals[key];
    return setModal(m);
  };

  return (
    <div id={`${type}-set-dropdown-container`}>
      {modal.showModalSave && sqon && (
        <CreateEditModal
          title={`Save ${singuralizeSetTypeIfNeeded(type).toLocaleUpperCase()} Set`}
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
      <Dropdown
        overlay={menu(
          getSetCount(selectedKeys || [], results.total, selectedAllResults),
          onClick,
          isEditDisabled,
          type,
        )}
        placement="bottomLeft"
        trigger={['click']}
        disabled={selectedKeys.length === 0 && !selectedAllResults}
        getPopupContainer={() =>
          document.getElementById(`${type}-set-dropdown-container`) as HTMLElement
        }
      >
        <Button className={'save-set-btn'} onClick={(e) => e.preventDefault()}>
          {`Save ${singuralizeSetTypeIfNeeded(type)} set`}
          <DownOutlined />
        </Button>
      </Dropdown>
    </div>
  );
};

export default SetsManagementDropdown;
