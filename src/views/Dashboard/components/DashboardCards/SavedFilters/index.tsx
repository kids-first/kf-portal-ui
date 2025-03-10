import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import { FileSearchOutlined } from '@ant-design/icons';
import Empty from '@ferlab/ui/core/components/Empty';
import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { List, Tabs, Typography } from 'antd';
import cx from 'classnames';
import CardErrorPlaceholder from 'views/Dashboard/components/CardErrorPlaceHolder';
import CardHeader from 'views/Dashboard/components/CardHeader';
import { DashboardCardProps } from 'views/Dashboard/components/DashboardCards';

import LineStyleIcon from 'components/Icons/LineStyleIcon';
import { SavedFilterTag, TUserSavedFilter } from 'services/api/savedFilter/models';
import { SUPPORT_EMAIL } from 'store/report/thunks';
import { useSavedFilter } from 'store/savedFilter';
import { STATIC_ROUTES } from 'utils/routes';

import SavedFiltersListItem from './ListItem';

import styles from './index.module.css';

const { Text } = Typography;

type SavedFilterListWrapperOwnprops = {
  tags: SavedFilterTag[];
  savedFilters: TUserSavedFilter[];
  fetchingError: boolean;
  isLoading: boolean;
};

const SavedFilterListWrapper = ({
  tags,
  savedFilters,
  fetchingError,
  isLoading,
}: SavedFilterListWrapperOwnprops) => (
  <List<TUserSavedFilter>
    className={styles.savedFiltersList}
    key={tags[0]}
    bordered
    locale={{
      emptyText: fetchingError ? (
        <CardErrorPlaceholder
          title={intl.get('screen.dashboard.cards.savedFilters.errorCard.failedToFetch')}
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
          description={
            <Text>
              {intl.get('screen.dashboard.cards.savedFilters.noSavedFilters')}
              <Link to={STATIC_ROUTES.DATA_EXPLORATION}>
                {intl.get('screen.dashboard.cards.infoPopover.dataExploLink')}
              </Link>
              {intl.get('screen.dashboard.cards.infoPopover.and')}
              <Link to={STATIC_ROUTES.VARIANTS}>
                {intl.get('screen.dashboard.cards.infoPopover.variantsLink')}
              </Link>
              {intl.get('screen.dashboard.cards.infoPopover.pages')}
            </Text>
          }
          noPadding
        />
      ),
    }}
    dataSource={
      fetchingError ? [] : savedFilters.filter((s) => tags.includes(s.tag as SavedFilterTag))
    }
    loading={isLoading}
    renderItem={(item) => <SavedFiltersListItem id={item.id} data={item} />}
  />
);

const SavedFilters = ({ id, key, className = '' }: DashboardCardProps) => {
  const { savedFilters, isLoading, fetchingError } = useSavedFilter();

  return (
    <GridCard
      theme="shade"
      wrapperClassName={className}
      title={
        <CardHeader
          id={id}
          key={key}
          title={intl.get('screen.dashboard.cards.savedFilters.title')}
          withHandle
          infoPopover={{
            title: intl.get('screen.dashboard.cards.savedFilters.infoPopover.title'),
            content: (
              <Text>
                {intl.get('screen.dashboard.cards.savedFilters.infoPopover.content')}
                <Link to={STATIC_ROUTES.DATA_EXPLORATION}>
                  {intl.get('screen.dashboard.cards.infoPopover.dataExploLink')}
                </Link>
                {intl.get('screen.dashboard.cards.infoPopover.and')}
                <Link to={STATIC_ROUTES.VARIANTS}>
                  {intl.get('screen.dashboard.cards.infoPopover.variantsLink')}
                </Link>
                {intl.get('screen.dashboard.cards.infoPopover.pages')}
              </Text>
            ),
          }}
        />
      }
      content={
        <Tabs
          className={cx(styles.setTabs, 'navNoMarginBtm')}
          defaultActiveKey={SavedFilterTag.ParticipantsExplorationPage}
          items={[
            {
              key: SavedFilterTag.ParticipantsExplorationPage,
              label: (
                <div>
                  <FileSearchOutlined />
                  {intl.get('screen.dashboard.cards.savedFilters.tabs.dataExploration')} (
                  {
                    savedFilters.filter((s) => s.tag === SavedFilterTag.ParticipantsExplorationPage)
                      .length
                  }
                  )
                </div>
              ),
              children: (
                <SavedFilterListWrapper
                  tags={[SavedFilterTag.ParticipantsExplorationPage]}
                  savedFilters={savedFilters}
                  fetchingError={fetchingError}
                  isLoading={isLoading}
                />
              ),
            },
            {
              key: SavedFilterTag.VariantsExplorationPage,
              label: (
                <div>
                  <LineStyleIcon height={14} width={14} />
                  {intl.get('screen.dashboard.cards.savedFilters.tabs.variants')} (
                  {
                    savedFilters.filter(
                      (s) =>
                        s.tag === SavedFilterTag.VariantsExplorationPage ||
                        s.tag === SavedFilterTag.VariantsSomaticExplorationPage,
                    ).length
                  }
                  )
                </div>
              ),
              children: (
                <SavedFilterListWrapper
                  tags={[
                    SavedFilterTag.VariantsExplorationPage,
                    SavedFilterTag.VariantsSomaticExplorationPage,
                  ]}
                  savedFilters={savedFilters}
                  fetchingError={fetchingError}
                  isLoading={isLoading}
                />
              ),
            },
          ]}
        />
      }
    />
  );
};

export default SavedFilters;
