import { useState } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ListItemWithActions from '@ferlab/ui/core/components/List/ListItemWithActions';
import { setQueryBuilderState } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { Modal, Tag } from 'antd';
import { formatDistance } from 'date-fns';

import { FILTER_ID_QUERY_PARAM_KEY } from 'common/constants';
import { FILTER_TAG_PAGE_MAPPING, FILTER_TAG_QB_ID_MAPPING } from 'common/queryBuilder';
import { SavedFilterTag, TUserSavedFilter } from 'services/api/savedFilter/models';
import { deleteSavedFilter } from 'store/savedFilter/thunks';

import EditModal from '../EditModal';

import styles from './index.module.css';

interface OwnProps {
  id: any;
  data: TUserSavedFilter;
}

const SavedFiltersListItem = ({ data }: OwnProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let tag;
  if (data.tag === SavedFilterTag.VariantsExplorationPage)
    tag = (
      <Tag className={styles.germlineTag}>
        {intl.get('screen.dashboard.cards.savedFilters.tabs.germline')}
      </Tag>
    );
  else if (data.tag === SavedFilterTag.VariantsSomaticExplorationPage)
    tag = (
      <Tag className={styles.somaticTag} color="cyan">
        {intl.get('screen.dashboard.cards.savedFilters.tabs.somatic')}
      </Tag>
    );

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
        title={
          <>
            {data.title}
            {tag && tag}
          </>
        }
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
