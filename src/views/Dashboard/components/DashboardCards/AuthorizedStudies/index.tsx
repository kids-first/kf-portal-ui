import { useEffect } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { DisconnectOutlined, SafetyOutlined } from '@ant-design/icons';
import Empty from '@ferlab/ui/core/components/Empty';
import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { Button, List, Space } from 'antd';
import Text from 'antd/lib/typography/Text';
import CardConnectPlaceholder from 'views/Dashboard/components/CardConnectPlaceholder';
import CardErrorPlaceholder from 'views/Dashboard/components/CardErrorPlaceHolder';
import CardHeader from 'views/Dashboard/components/CardHeader';
import { DashboardCardProps } from 'views/Dashboard/components/DashboardCards';

import { FENCE_NAMES } from 'common/fenceTypes';
import PopoverContentLink from 'components/uiKit/PopoverContentLink';
import { connectToFence, disconnectFromFence } from 'store/fenceConnection/thunks';
import { useFenceStudies } from 'store/fenceStudies';
import { fetchAllFenceStudies } from 'store/fenceStudies/thunks';
import { TFenceStudy } from 'store/fenceStudies/types';

import AuthorizedStudiesListItem from './ListItem';

import styles from './index.module.scss';

const AuthorizedStudies = ({ id, className = '' }: DashboardCardProps) => {
  const dispatch = useDispatch();
  const { loadingStudiesForFences, fenceStudiesAcls, isConnected, hasErrors, connectionLoading } =
    useFenceStudies();
  const fenceStudiesLoading = loadingStudiesForFences.length > 0;

  useEffect(() => {
    if (isConnected) {
      dispatch(fetchAllFenceStudies());
    }
    // eslint-disable-next-line
  }, [isConnected]);

  return (
    <GridCard
      theme="shade"
      wrapperClassName={className}
      title={
        <CardHeader
          id={id}
          title={intl.get('screen.dashboard.cards.authorizedStudies.title', {
            count: isConnected ? fenceStudiesAcls.length : 0,
          })}
          infoPopover={{
            title: intl.get('screen.dashboard.cards.authorizedStudies.infoPopover.title'),
            content: (
              <Space direction="vertical" className={styles.content} size={0}>
                <Text>
                  {intl.getHTML('screen.dashboard.cards.authorizedStudies.infoPopover.content')}{' '}
                  <PopoverContentLink
                    externalHref="https://dbgap.ncbi.nlm.nih.gov/aa/wga.cgi?login=&page=login"
                    title={intl.get(
                      'screen.dashboard.cards.authorizedStudies.infoPopover.applyingForDataAccess',
                    )}
                  />
                  .
                </Text>
              </Space>
            ),
          }}
          withHandle
        />
      }
      content={
        <div className={styles.authorizedWrapper}>
          {isConnected && !hasErrors && !fenceStudiesLoading && (
            <Space className={styles.authenticatedHeader} direction="horizontal">
              <Space align="start">
                <SafetyOutlined className={styles.safetyIcon} />
                <Text className={styles.notice}>
                  {intl.get('screen.dashboard.cards.authorizedStudies.connectedNotice')}{' '}
                  <Button
                    type="link"
                    size="small"
                    danger
                    icon={<DisconnectOutlined />}
                    onClick={() => dispatch(connectToFence(FENCE_NAMES.gen3))}
                    className={styles.disconnectBtn}
                    loading={connectionLoading}
                  >
                      {intl.get('screen.dashboard.cards.authorizedStudies.manageConnections')}
                  </Button>
                </Text>
              </Space>
            </Space>
          )}
          <List<TFenceStudy>
            className={styles.authorizedStudiesList}
            bordered
            itemLayout="vertical"
            loading={fenceStudiesLoading || connectionLoading}
            locale={{
              emptyText: hasErrors ? (
                <CardErrorPlaceholder />
              ) : isConnected ? (
                <Empty
                  imageType="grid"
                  description={intl.get(
                    'screen.dashboard.cards.authorizedStudies.noAvailableStudies',
                  )}
                />
              ) : (
                <CardConnectPlaceholder
                  icon={<SafetyOutlined className={styles.safetyIcon} />}
                  description={intl.get(
                    'screen.dashboard.cards.authorizedStudies.disconnectedNotice',
                  )}
                  btnProps={{
                    onClick: () => dispatch(connectToFence(FENCE_NAMES.gen3)),
                  }}
                />
              ),
            }}
            dataSource={isConnected && !hasErrors ? fenceStudiesAcls : []}
            renderItem={(item) => <AuthorizedStudiesListItem id={item.id} data={item} />}
          ></List>
        </div>
      }
    />
  );
};

export default AuthorizedStudies;
