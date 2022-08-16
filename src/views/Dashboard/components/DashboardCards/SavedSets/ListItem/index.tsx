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
import { distanceInWords } from 'date-fns';
import CreateEditModal from '../CreateEditModal';
import { deleteSavedSet } from 'store/savedSet/thunks';
import { addQuery } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { INDEXES } from 'graphql/constants';
import { SetActionType } from 'views/DataExploration/components/SetsManagementDropdown';
import { SET_ID_PREFIX } from '@ferlab/ui/core/data/sqon/types';
import { getSetFieldId } from 'store/savedSet';
import ListItemWithActions from 'components/uiKit/list/ListItemWithActions';

import styles from './index.module.scss';

interface OwnProps {
  data: IUserSetOutput;
  icon: ReactElement;
}

const { Text } = Typography;

const redirectToPage = (setType: string) => {
  switch (setType) {
    case INDEXES.FILE:
      return `${DATA_EPLORATION_FILTER_TAG}/datafiles`;
    case INDEXES.PARTICIPANT:
      return `${DATA_EPLORATION_FILTER_TAG}/participants`;
    case INDEXES.BIOSPECIMEN:
      return `${DATA_EPLORATION_FILTER_TAG}/biospecimens`;
    default:
      return DATA_EPLORATION_FILTER_TAG;
  }
};

const ListItem = ({ data, icon }: OwnProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();

  const onCancel = () => {
    setModalVisible(false);
  };

  return (
    <>
      <ListItemWithActions
        key={data.id}
        className={styles.savedSetListItem}
        onEditCb={() => setModalVisible(true)}
        onDeleteCb={() =>
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
        linkProps={{
          to: redirectToPage(data.setType),
          content: (
            <Text style={{ width: 400 }} ellipsis={{ tooltip: data.tag }}>
              {data.tag}
            </Text>
          ),
          onClick: () => {
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
          },
        }}
        description={intl.get('screen.dashboard.cards.savedFilters.lastSaved', {
          date: distanceInWords(new Date(), new Date(data.updated_date)),
        })}
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
