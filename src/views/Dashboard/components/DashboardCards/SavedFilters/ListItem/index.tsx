import { Modal, Typography } from 'antd';
import { TUserSavedFilter } from 'services/api/savedFilter/models';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { deleteSavedFilter } from 'store/savedFilter/thunks';
import { distanceInWords } from 'date-fns';
import EditModal from '../EditModal';
import { setQueryBuilderState } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { FILTER_ID_QUERY_PARAM_KEY } from 'common/constants';
import { FILTER_TAG_PAGE_MAPPING, FILTER_TAG_QB_ID_MAPPING } from 'common/queryBuilder';
import ListItemWithActions from 'components/uiKit/list/ListItemWithActions';

interface OwnProps {
  id: any;
  data: TUserSavedFilter;
}

const { Text } = Typography;

const SavedFiltersListItem = ({ data }: OwnProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();

  return (
    <>
      <ListItemWithActions
        key={data.id}
        onEditCb={() => setModalVisible(true)}
        onDeleteCb={() =>
          Modal.confirm({
            title: intl.get('components.querybuilder.header.popupConfirm.delete.title'),
            icon: <ExclamationCircleOutlined />,
            okText: intl.get('components.querybuilder.header.popupConfirm.delete.okText'),
            content: intl.get('components.querybuilder.header.popupConfirm.delete.content'),
            cancelText: intl.get('components.querybuilder.header.popupConfirm.delete.cancelText'),
            okButtonProps: { danger: true },
            onOk: () => dispatch(deleteSavedFilter(data.id)),
          })
        }
        linkProps={{
          to: {
            pathname: FILTER_TAG_PAGE_MAPPING[data.tag],
            search: `?${FILTER_ID_QUERY_PARAM_KEY}=${data.id}`,
          },
          content: (
            <Text style={{ width: 400 }} ellipsis={{ tooltip: data.title }}>
              {data.title}
            </Text>
          ),
          onClick: () =>
            setQueryBuilderState(FILTER_TAG_QB_ID_MAPPING[data.tag], {
              active: data.queries[0].id,
              state: data.queries,
            }),
        }}
        description={intl.get('screen.dashboard.cards.savedFilters.lastSaved', {
          date: distanceInWords(new Date(), new Date(data.updated_date)),
        })}
      />
      <EditModal visible={modalVisible} onCancel={() => setModalVisible(false)} filter={data} />
    </>
  );
};

export default SavedFiltersListItem;
