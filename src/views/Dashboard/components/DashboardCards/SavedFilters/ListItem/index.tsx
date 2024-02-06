import { useState } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ListItemWithActions from '@ferlab/ui/core/components/List/ListItemWithActions';
import { setQueryBuilderState } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { Modal } from 'antd';
import { formatDistance } from 'date-fns';

import { FILTER_ID_QUERY_PARAM_KEY } from 'common/constants';
import { FILTER_TAG_PAGE_MAPPING, FILTER_TAG_QB_ID_MAPPING } from 'common/queryBuilder';
import { TUserSavedFilter } from 'services/api/savedFilter/models';
import { deleteSavedFilter } from 'store/savedFilter/thunks';

import EditModal from '../EditModal';

interface OwnProps {
  id: any;
  data: TUserSavedFilter;
}

const SavedFiltersListItem = ({ data }: OwnProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <>
      <ListItemWithActions
        key={data.id}
        onEdit={() => setModalVisible(true)}
        onDelete={() =>
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
        onClick={() => {
          navigate(`${FILTER_TAG_PAGE_MAPPING[data.tag]}?${FILTER_ID_QUERY_PARAM_KEY}=${data.id}`);

          setQueryBuilderState(FILTER_TAG_QB_ID_MAPPING[data.tag], {
            active: data.queries[0].id,
            state: data.queries,
          });
        }}
        title={data.title}
        description={
          data.updated_date
            ? intl.get('screen.dashboard.cards.savedFilters.lastSaved', {
                date: formatDistance(new Date(), new Date(data.updated_date)),
              })
            : undefined
        }
      />
      <EditModal visible={modalVisible} onCancel={() => setModalVisible(false)} filter={data} />
    </>
  );
};

export default SavedFiltersListItem;
