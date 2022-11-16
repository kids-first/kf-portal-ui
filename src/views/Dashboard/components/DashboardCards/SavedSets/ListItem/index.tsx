import { Col, Modal, Row, Typography } from 'antd';
import { IUserSetOutput } from 'services/api/savedSet/models';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { ReactElement, useState } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import {
  DATA_EPLORATION_FILTER_TAG,
  DATA_EXPLORATION_QB_ID,
} from 'views/DataExploration/utils/constant';
import { formatDistance } from 'date-fns';
import CreateEditModal from '../CreateEditModal';
import { deleteSavedSet } from 'store/savedSet/thunks';
import { addQuery } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { INDEXES } from 'graphql/constants';
import { SetActionType } from 'views/DataExploration/components/SetsManagementDropdown';
import { SET_ID_PREFIX } from '@ferlab/ui/core/data/sqon/types';
import { getSetFieldId } from 'store/savedSet';

import styles from './index.module.scss';
import ListItemWithActions from '@ferlab/ui/core/components/List/ListItemWithActions';
import { useHistory } from 'react-router-dom';

interface OwnProps {
  data: IUserSetOutput;
  icon: ReactElement;
}

const { Text } = Typography;

const redirectToPage = (setType: string) => {
  switch (setType) {
    case INDEXES.FILES:
      return `${DATA_EPLORATION_FILTER_TAG}/datafiles`;
    case INDEXES.PARTICIPANT:
      return `${DATA_EPLORATION_FILTER_TAG}/participants`;
    case INDEXES.BIOSPECIMENS:
      return `${DATA_EPLORATION_FILTER_TAG}/biospecimens`;
    default:
      return DATA_EPLORATION_FILTER_TAG;
  }
};

const ListItem = ({ data, icon }: OwnProps) => {
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
              <Text className={styles.count}>{data.size}</Text>
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
            queryBuilderId: DATA_EXPLORATION_QB_ID,
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
