import { ReactElement, useState } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ListItemWithActions from '@ferlab/ui/core/components/List/ListItemWithActions';
import { addQuery } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { SET_ID_PREFIX } from '@ferlab/ui/core/data/sqon/types';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { Col, Modal, Row, Typography } from 'antd';
import { formatDistance } from 'date-fns';
import { INDEXES } from 'graphql/constants';
import { SetActionType } from 'views/DataExploration/components/SetsManagementDropdown';
import {
  BIOSPECIMENS_SAVED_SETS_FIELD,
  DATA_FILES_SAVED_SETS_FIELD,
  PARTICIPANTS_SAVED_SETS_FIELD,
} from 'views/DataExploration/utils/constant';
import { VARIANT_SAVED_SETS_FIELD } from '../../../../../Variants/utils/constants';

import { IUserSetOutput } from 'services/api/savedSet/models';
import { getSetFieldId } from 'store/savedSet';
import { deleteSavedSet } from 'store/savedSet/thunks';
import { STATIC_ROUTES } from 'utils/routes';
import { numberWithCommas } from 'utils/string';

import CreateEditModal from '../CreateEditModal';

import styles from './index.module.scss';

interface OwnProps {
  data: IUserSetOutput;
  icon: ReactElement;
  queryBuilderId: string;
}

const { Text } = Typography;

const redirectToPage = (setType: string) => {
  switch (setType) {
    case INDEXES.FILE:
      return STATIC_ROUTES.DATA_EXPLORATION_DATAFILES;
    case INDEXES.PARTICIPANT:
      return STATIC_ROUTES.DATA_EXPLORATION_PARTICIPANTS;
    case INDEXES.BIOSPECIMEN:
      return STATIC_ROUTES.DATA_EXPLORATION_BIOSPECIMENS;
    case INDEXES.VARIANTS:
      return STATIC_ROUTES.VARIANTS;
    default:
      return STATIC_ROUTES.DATA_EXPLORATION;
  }
};

const getIdField = (setType: string) => {
  switch (setType) {
    case INDEXES.FILE:
      return DATA_FILES_SAVED_SETS_FIELD;
    case INDEXES.PARTICIPANT:
      return PARTICIPANTS_SAVED_SETS_FIELD;
    case INDEXES.BIOSPECIMEN:
      return BIOSPECIMENS_SAVED_SETS_FIELD;
    default:
      return VARIANT_SAVED_SETS_FIELD;
  }
};

const ListItem = ({ data, icon, queryBuilderId }: OwnProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  const onCancel = () => {
    setModalVisible(false);
  };

  return (
    <>
      <ListItemWithActions
        key={data.id}
        className={styles.savedSetListItem}
        onEdit={() => setModalVisible(true)}
        onDelete={() =>
          Modal.confirm({
            title: intl.get('components.savedSets.popupConfirm.delete.title'),
            icon: <ExclamationCircleOutlined />,
            okText: intl.get('components.savedSets.popupConfirm.delete.okText'),
            content: intl.get('components.savedSets.popupConfirm.delete.content'),
            cancelText: intl.get('components.savedSets.popupConfirm.delete.cancelText'),
            okButtonProps: { danger: true },
            onOk: () => dispatch(deleteSavedSet(data.id)),
          })
        }
        extra={
          <Row gutter={8} className={styles.countDisplay}>
            <Col>
              <Text className={styles.count}>{numberWithCommas(data.size)}</Text>
            </Col>
            <Col>
              <Text type="secondary">{icon}</Text>
            </Col>
          </Row>
        }
        onClick={() => {
          history.push(redirectToPage(data.setType));

          const setValue = `${SET_ID_PREFIX}${data.id}`;
          addQuery({
            queryBuilderId: queryBuilderId,
            query: generateQuery({
              newFilters: [
                generateValueFilter({
                  field: getSetFieldId(data.setType),
                  value: [setValue],
                  index: data.setType,
                }),
              ],
            }),
            setAsActive: true,
          });
        }}
        title={data.tag}
        description={
          data.updated_date
            ? intl.get('screen.dashboard.cards.savedFilters.lastSaved', {
                date: formatDistance(new Date(), new Date(data.updated_date)),
              })
            : undefined
        }
      />
      <CreateEditModal
        idField={getIdField(data.setType)}
        title={intl.get('components.savedSets.modal.edit.title')}
        setType={data.setType}
        hideModalCb={onCancel}
        visible={modalVisible}
        currentSaveSet={data}
        saveSetActionType={SetActionType.UPDATE_SET}
      />
    </>
  );
};

export default ListItem;
