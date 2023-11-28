import intl from 'react-intl-universal';
import { FileSearchOutlined } from '@ant-design/icons';
import Empty from '@ferlab/ui/core/components/Empty';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink';
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

import styles from './index.module.scss';

const { Text } = Typography;
const { TabPane } = Tabs;

type SavedFilterListWrapperOwnprops = {
  tag: SavedFilterTag;
  savedFilters: TUserSavedFilter[];
  fetchingError: boolean;
  isLoading: boolean;
};

const SavedFilterListWrapper = ({
  tag,
  savedFilters,
  fetchingError,
  isLoading,
}: SavedFilterListWrapperOwnprops) => (
  <List<TUserSavedFilter>
    className={styles.savedFiltersList}
    key={tag}
    bordered
    locale={{
      emptyText: fetchingError ? (
        <CardErrorPlaceholder
          title="Failed to Fetch Saved Filters"
          subTitle={
            <Text>
              Please refresh and try again or
              <ExternalLink href={`mailto:${SUPPORT_EMAIL}`}>
                <Text>contact our support</Text>
              </ExternalLink>
              .
            </Text>
          }
        />
      ) : (
        <Empty
          imageType="grid"
          description={intl.getHTML('screen.dashboard.cards.savedFilters.noSavedFilters', {
            dataExploHref: STATIC_ROUTES.DATA_EXPLORATION,
            variantsHref: STATIC_ROUTES.VARIANTS,
          })}
          noPadding
        />
      ),
    }}
    dataSource={fetchingError ? [] : savedFilters.filter((s) => s.tag === tag)}
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
                {intl.getHTML('screen.dashboard.cards.savedFilters.infoPopover.content', {
                  dataExploHref: STATIC_ROUTES.DATA_EXPLORATION,
                  variantsHref: STATIC_ROUTES.VARIANTS,
                })}
              </Text>
            ),
          }}
        />
      }
      content={
        <Tabs
          className={cx(styles.setTabs, 'navNoMarginBtm')}
          defaultActiveKey={SavedFilterTag.ParticipantsExplorationPage}
        >
          <TabPane
            key={SavedFilterTag.ParticipantsExplorationPage}
            tab={
              <div>
                <FileSearchOutlined />
                Data Exploration (
                {
                  savedFilters.filter((s) => s.tag === SavedFilterTag.ParticipantsExplorationPage)
                    .length
                }
                )
              </div>
            }
          >
            <SavedFilterListWrapper
              tag={SavedFilterTag.ParticipantsExplorationPage}
              savedFilters={savedFilters}
              fetchingError={fetchingError}
              isLoading={isLoading}
            />
          </TabPane>

          <TabPane
            key={SavedFilterTag.VariantsExplorationPage}
            tab={
              <div>
                <LineStyleIcon height={14} width={14} />
                Variants (
                {
                  savedFilters.filter((s) => s.tag === SavedFilterTag.VariantsExplorationPage)
                    .length
                }
                )
              </div>
            }
          >
            <SavedFilterListWrapper
              tag={SavedFilterTag.VariantsExplorationPage}
              savedFilters={savedFilters}
              fetchingError={fetchingError}
              isLoading={isLoading}
            />
          </TabPane>
        </Tabs>
      }
    />
  );
};

export default SavedFilters;
