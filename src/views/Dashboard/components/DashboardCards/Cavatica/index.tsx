import { useEffect } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { DisconnectOutlined, PlusOutlined, SafetyOutlined } from '@ant-design/icons';
import Empty from '@ferlab/ui/core/components/Empty';
import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { Button, List, Space } from 'antd';
import Text from 'antd/lib/typography/Text';
import CardConnectPlaceholder from 'views/Dashboard/components/CardConnectPlaceholder';
import CardHeader from 'views/Dashboard/components/CardHeader';
import { DashboardCardProps } from 'views/Dashboard/components/DashboardCards';

import { FENCE_NAMES } from 'common/fenceTypes';
import CreateProjectModal from 'components/Cavatica/CreateProjectModal';
import CavaticaIcon from 'components/Icons/CavaticaIcon';
import PopoverContentLink from 'components/uiKit/PopoverContentLink';
import { useFenceCavatica } from 'store/fenceCavatica';
import { fenceCavaticaActions } from 'store/fenceCavatica/slice';
import { fetchAllProjects } from 'store/fenceCavatica/thunks';
import { TCavaticaProjectWithMembers } from 'store/fenceCavatica/types';
import { connectToFence, disconnectFromFence } from 'store/fenceConnection/thunks';

import CavaticaListItem from './ListItem';

import styles from './index.module.scss';

const Cavatica = ({ id, className = '' }: DashboardCardProps) => {
  const dispatch = useDispatch();
  const { projects, isLoading, isConnected, connectionLoading } = useFenceCavatica();

  useEffect(() => {
    if (isConnected) {
      dispatch(fetchAllProjects());
    }
    // eslint-disable-next-line
  }, [isConnected]);

  return (
    <>
      <GridCard
        theme="shade"
        wrapperClassName={className}
        title={
          <CardHeader
            id={id}
            title={intl.get('screen.dashboard.cards.cavatica.title')}
            infoPopover={{
              title: intl.get('screen.dashboard.cards.cavatica.infoPopover.title'),
              content: (
                <Space direction="vertical" className={styles.content} size={0}>
                  <Text>
                    {intl.get('screen.dashboard.cards.cavatica.infoPopover.content')}{' '}
                    <PopoverContentLink
                      externalHref="https://www.cavatica.org/"
                      title={intl.get('screen.dashboard.cards.cavatica.infoPopover.readMore')}
                    />
                  </Text>
                </Space>
              ),
            }}
            withHandle
          />
        }
        content={
          <div className={styles.cavaticaWrapper}>
            {isConnected && (
              <Space className={styles.authenticatedHeader} direction="horizontal">
                <Space align="start">
                  <SafetyOutlined className={styles.safetyIcon} />
                  <Text className={styles.notice}>
                    {intl.get('screen.dashboard.cards.cavatica.connectedNotice')}
                    <Button
                      type="link"
                      size="small"
                      danger
                      icon={<DisconnectOutlined />}
                      onClick={() => dispatch(disconnectFromFence(FENCE_NAMES.cavatica))}
                      className={styles.disconnectBtn}
                      loading={connectionLoading}
                    >
                      {intl.get('screen.dashboard.cards.cavatica.disconnect')}
                    </Button>
                  </Text>
                </Space>
              </Space>
            )}
            <List<TCavaticaProjectWithMembers>
              className={styles.cavaticaProjectsList}
              bordered
              itemLayout="vertical"
              loading={isLoading || connectionLoading}
              locale={{
                emptyText: isConnected ? (
                  <Empty
                    imageType="grid"
                    description={intl.get('screen.dashboard.cards.cavatica.noProjects')}
                    action={
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        size="small"
                        onClick={() => dispatch(fenceCavaticaActions.beginCreateProject())}
                      >
                        {intl.get('screen.dashboard.cards.cavatica.createNewProject')}
                      </Button>
                    }
                  />
                ) : (
                  <CardConnectPlaceholder
                    icon={<CavaticaIcon />}
                    description={intl.get('screen.dashboard.cards.cavatica.disconnectedNotice')}
                    btnProps={{
                      onClick: () => dispatch(connectToFence(FENCE_NAMES.cavatica)),
                    }}
                  />
                ),
              }}
              dataSource={isConnected ? projects : []}
              renderItem={(item) => <CavaticaListItem id={item.id} data={item} />}
            ></List>
            {(isConnected ? projects : []).length > 0 && (
              <div className={styles.customFooter}>
                <Button
                  icon={<PlusOutlined />}
                  className={styles.newProjectBtn}
                  size="small"
                  onClick={() => dispatch(fenceCavaticaActions.beginCreateProject())}
                >
                  {intl.get('screen.dashboard.cards.cavatica.newProject')}
                </Button>
              </div>
            )}
          </div>
        }
      />
      {isConnected && <CreateProjectModal openAnalyseModalOnClose={false} />}
    </>
  );
};

export default Cavatica;
