import React, { ReactNode } from 'react';
import { DeleteFilled, WarningFilled } from '@ant-design/icons';
import { Alert, Button, List, Popconfirm, Space } from 'antd';
import { distanceInWords } from 'date-fns';

import { SavedQueriesStatuses, SavedQueryWithFileContent } from 'store/SavedQueriesTypes';
import { VirtualStudyPlusId } from 'store/virtualStudiesTypes';
import styleThemeColors from 'style/themes/default/colors.module.scss';
import { toKebabCase } from 'utils';

import './SavedQueries.scss';

type Item = VirtualStudyPlusId | SavedQueryWithFileContent;

type Items = Array<Item>;

type Props = {
  items: Items;
  queryIdToStatus: Record<string, SavedQueriesStatuses>;
  makeDescription: (item: Item) => ReactNode;
  makeItemTitle: (item: Item) => ReactNode;
  makeNoItemsInfoMessage: () => ReactNode;
  onConfirmCb: (item: Item) => Promise<void>;
};

const sortByEarliestToLatest = (items: Items) =>
  [...items].sort((a, b) => Number(new Date(b.creationDate)) - Number(new Date(a.creationDate)));

const SavedQueriesTab = (props: Props) => {
  const {
    items,
    queryIdToStatus,
    makeDescription,
    makeItemTitle,
    makeNoItemsInfoMessage,
    onConfirmCb,
  } = props;

  if (items.length === 0) {
    return <Alert message={makeNoItemsInfoMessage()} type="info" />;
  }
  const sortedQueries = sortByEarliestToLatest(items);

  return (
    <List
      size={'small'}
      itemLayout="horizontal"
      className="saved-queries-list"
      dataSource={sortedQueries}
      renderItem={(item) => {
        const currentItemIsDeleting = queryIdToStatus[item.id] === SavedQueriesStatuses.deleting;
        const currentItemIsInError = queryIdToStatus[item.id] === SavedQueriesStatuses.error;
        return (
          <List.Item
            actions={[
              <Popconfirm
                key={`popUp-${toKebabCase(item.id)}`}
                title={'Permanently delete this query?'}
                okText="Delete"
                cancelText="Cancel"
                onConfirm={async () => {
                  await onConfirmCb(item);
                }}
              >
                <Button
                  type={'text'}
                  icon={
                    currentItemIsInError ? (
                      <WarningFilled style={{ color: styleThemeColors.warningColor }} />
                    ) : (
                      <DeleteFilled />
                    )
                  }
                  disabled={currentItemIsDeleting || currentItemIsInError}
                  loading={currentItemIsDeleting}
                />
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta
              title={makeItemTitle(item)}
              description={
                <Space direction={'vertical'}>
                  {makeDescription(item)}
                  <span className={'time-ago'}>
                    Saved {distanceInWords(new Date(), new Date(item.creationDate))} ago
                  </span>
                  {currentItemIsInError && (
                    <Alert
                      type={'error'}
                      message={
                        'An error occurred while trying to delete the query.' +
                        ' Please refresh and retry or contact support.'
                      }
                    />
                  )}
                </Space>
              }
            />
          </List.Item>
        );
      }}
    />
  );
};

export default SavedQueriesTab;
