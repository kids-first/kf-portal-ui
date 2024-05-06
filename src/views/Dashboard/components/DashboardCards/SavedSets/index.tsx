import { ReactElement } from 'react';
import intl from 'react-intl-universal';
import { ExperimentOutlined, FileTextOutlined, UserOutlined } from '@ant-design/icons';
import Empty from '@ferlab/ui/core/components/Empty';
import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { List, Tabs, Typography } from 'antd';
import cx from 'classnames';
import CardErrorPlaceholder from 'views/Dashboard/components/CardErrorPlaceHolder';
import CardHeader from 'views/Dashboard/components/CardHeader';
import { DashboardCardProps } from 'views/Dashboard/components/DashboardCards';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';
import { VARIANT_REPO_QB_ID } from 'views/Variants/utils/constants';

import LineStyleIcon from 'components/Icons/LineStyleIcon';
import { IUserSetOutput, SetType } from 'services/api/savedSet/models';
import { SUPPORT_EMAIL } from 'store/report/thunks';
import { useSavedSet } from 'store/savedSet';
import { STATIC_ROUTES } from 'utils/routes';

import ListItem from './ListItem';

import styles from './index.module.scss';
import { Link } from 'react-router-dom';

const { Text } = Typography;
const { TabPane } = Tabs;

const getItemList = (
  type: SetType,
  savedSets: IUserSetOutput[],
  fetchingError: boolean,
  isLoading: boolean,
  icon: ReactElement,
  queryBuilderId = DATA_EXPLORATION_QB_ID,
) => (
  <List<IUserSetOutput>
    className={styles.savedSetsList}
    bordered
    locale={{
      emptyText: fetchingError ? (
        <CardErrorPlaceholder
          title={intl.get('screen.dashboard.cards.savedSets.errorCard.failedToFetch')}
          subTitle={
            <Text>
              {intl.getHTML('screen.dashboard.cards.savedFilters.errorCard.message', {
                href: `mailto:${SUPPORT_EMAIL}`,
              })}
            </Text>
          }
        />
      ) : (
        <Empty
          imageType="grid"
          // @ts-ignore cuz the type description is a string
          description={
            <Text>
              {intl.get('screen.dashboard.cards.savedSets.noSavedSets')}
              <Link to={`${STATIC_ROUTES.DATA_EXPLORATION}`}>
                {intl.get('screen.dashboard.cards.infoPopover.dataExploLink')}
              </Link>
              {intl.get('screen.dashboard.cards.infoPopover.and')}
              <Link to={`${STATIC_ROUTES.VARIANTS}`}>
                {intl.get('screen.dashboard.cards.infoPopover.variantsLink')}
              </Link>
              {intl.get('screen.dashboard.cards.infoPopover.pages')}
            </Text>
          }
          noPadding
        />
      ),
    }}
    dataSource={fetchingError ? [] : savedSets.filter((s) => s.setType === type)}
    loading={isLoading}
    renderItem={(item) => <ListItem data={item} icon={icon} queryBuilderId={queryBuilderId} />}
  />
);

const SavedSets = ({ id, key, className = '' }: DashboardCardProps) => {
  const { savedSets, isLoading, fetchingError } = useSavedSet();

  return (
    <GridCard
      theme="shade"
      wrapperClassName={className}
      title={
        <CardHeader
          id={id}
          key={key}
          title={intl.get('screen.dashboard.cards.savedSets.title')}
          withHandle
          infoPopover={{
            title: intl.get('screen.dashboard.cards.savedSets.infoPopover.title'),
            content: (
              <Text>
                {intl.get('screen.dashboard.cards.savedSets.infoPopover.content')}
                <Link to={`${STATIC_ROUTES.DATA_EXPLORATION}`}>
                  {intl.get('screen.dashboard.cards.infoPopover.dataExploLink')}
                </Link>
                {intl.get('screen.dashboard.cards.infoPopover.and')}
                <Link to={`${STATIC_ROUTES.VARIANTS}`}>
                  {intl.get('screen.dashboard.cards.infoPopover.variantsLink')}
                </Link>
                {intl.get('screen.dashboard.cards.infoPopover.pages')}
              </Text>
            ),
          }}
        />
      }
      content={
        <Tabs className={cx(styles.setTabs, 'navNoMarginBtm')} defaultActiveKey="participants">
          <TabPane
            tab={
              <div>
                <UserOutlined />
                {intl.get('screen.dashboard.cards.savedSets.tabs.participants')} (
                {savedSets.filter((s) => s.setType === SetType.PARTICIPANT).length})
              </div>
            }
            key="participants"
          >
            {getItemList(
              SetType.PARTICIPANT,
              savedSets,
              fetchingError,
              isLoading,
              <UserOutlined />,
            )}
          </TabPane>
          <TabPane
            tab={
              <div>
                <ExperimentOutlined />
                {intl.get('screen.dashboard.cards.savedSets.tabs.biospecimens')} (
                {savedSets.filter((s) => s.setType === SetType.BIOSPECIMEN).length})
              </div>
            }
            key="biospecimen"
          >
            {getItemList(
              SetType.BIOSPECIMEN,
              savedSets,
              fetchingError,
              isLoading,
              <ExperimentOutlined />,
            )}
          </TabPane>
          <TabPane
            tab={
              <div>
                <FileTextOutlined />
                {intl.get('screen.dashboard.cards.savedSets.tabs.files')} (
                {savedSets.filter((s) => s.setType === SetType.FILE).length})
              </div>
            }
            key="files"
          >
            {getItemList(SetType.FILE, savedSets, fetchingError, isLoading, <FileTextOutlined />)}
          </TabPane>
          <TabPane
            tab={
              <div>
                <LineStyleIcon />
                {intl.get('screen.dashboard.cards.savedSets.tabs.variants')} (
                {savedSets.filter((s) => s.setType === SetType.VARIANT).length})
              </div>
            }
            key="variants"
          >
            {getItemList(
              SetType.VARIANT,
              savedSets,
              fetchingError,
              isLoading,
              <LineStyleIcon />,
              VARIANT_REPO_QB_ID,
            )}
          </TabPane>
        </Tabs>
      }
    />
  );
};

export default SavedSets;
