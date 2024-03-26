import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import {
  DownOutlined,
  FileSearchOutlined,
  HomeOutlined,
  LaptopOutlined,
  LogoutOutlined,
  MailOutlined,
  ReadOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import Gravatar from '@ferlab/ui/core/components/Gravatar';
import { useKeycloak } from '@react-keycloak/web';
import { Dropdown, Menu, PageHeader, Space, Typography } from 'antd';
import { formatProvider } from 'auth/keycloak-api/utils';
import cx from 'classnames';
import { getFTEnvVarByKey } from 'helpers/EnvVariables';

import { KidsFirstKeycloakTokenParsed } from 'common/tokenTypes';
import { AlterTypes } from 'common/types';
import NotificationBanner from 'components/featureToggle/NotificationBanner';
import ExternalLinkIcon from 'components/Icons/ExternalLinkIcon';
import KidsFirstIcon from 'components/Icons/KidsFirstIcon';
import LineStyleIcon from 'components/Icons/LineStyleIcon';
import HeaderLink from 'components/Layout/Header/HeaderLink';
import GradientAccent from 'components/uiKit/GradientAccent';
import { trackLogout, trackVisitResources } from 'services/analytics';
import { usePersona } from 'store/persona';
import { personaActions } from 'store/persona/slice';
import { SUPPORT_EMAIL } from 'store/report/thunks';
import { userActions } from 'store/user/slice';
import { STATIC_ROUTES } from 'utils/routes';

import styles from 'components/Layout/Header/index.module.scss';

const iconSize = { width: 14, height: 14 };
const FT_FLAG_KEY = 'SITE_WIDE_BANNER';
const BANNER_TYPE_KEY = FT_FLAG_KEY + '_TYPE';
const BANNER_MSG_KEY = FT_FLAG_KEY + '_MSG';

const { Text } = Typography;

const Header = () => {
  const { personaUserInfo } = usePersona();
  const userInfo = {
    first_name: personaUserInfo?.firstName,
    last_name: personaUserInfo?.lastName,
    email: personaUserInfo?.email,
    keycloak_id: personaUserInfo?.egoId,
  };
  const dispatch = useDispatch();
  const { keycloak } = useKeycloak();
  const location = useLocation();
  const currentPathName = location.pathname;
  const tokenParsed = keycloak.tokenParsed as KidsFirstKeycloakTokenParsed;

  return (
    <>
      <GradientAccent />
      <NotificationBanner
        className={styles.siteWideBanner}
        featureToggleKey={FT_FLAG_KEY}
        type={getFTEnvVarByKey<AlterTypes>(BANNER_TYPE_KEY, 'warning')}
        message={getFTEnvVarByKey(BANNER_MSG_KEY)}
        banner
        closable
      />
      <PageHeader
        title={<KidsFirstIcon className={styles.logo} />}
        subTitle={
          <nav className={styles.headerList}>
            <HeaderLink
              key="dashboard"
              currentPathName={currentPathName}
              to={STATIC_ROUTES.DASHBOARD}
              icon={<HomeOutlined />}
              title={intl.get('layout.main.menu.dashboard')}
            />
            <HeaderLink
              key="studies"
              currentPathName={currentPathName}
              to={STATIC_ROUTES.STUDIES}
              icon={<ReadOutlined />}
              title={intl.get('layout.main.menu.studies')}
            />
            <HeaderLink
              key="explore-data"
              currentPathName={currentPathName}
              to={[
                STATIC_ROUTES.DATA_EXPLORATION,
                STATIC_ROUTES.DATA_EXPLORATION_SUMMARY,
                STATIC_ROUTES.DATA_EXPLORATION_BIOSPECIMENS,
                STATIC_ROUTES.DATA_EXPLORATION_PARTICIPANTS,
                STATIC_ROUTES.DATA_EXPLORATION_DATAFILES,
              ]}
              icon={<FileSearchOutlined />}
              title={intl.get('layout.main.menu.explore')}
            />
            <HeaderLink
              key="variant-data"
              currentPathName={currentPathName}
              to={[STATIC_ROUTES.VARIANTS]}
              icon={<LineStyleIcon />}
              title={intl.get('layout.main.menu.variants')}
            />
          </nav>
        }
        extra={[
          <HeaderLink
            key="community"
            currentPathName={currentPathName}
            to={STATIC_ROUTES.COMMUNITY}
            icon={<TeamOutlined />}
            title={intl.get('layout.main.menu.community')}
          />,
          <Dropdown
            key="resources"
            trigger={['click']}
            overlayClassName={styles.dropdown}
            menu={{
              items: [
                {
                  key: 'website',
                  disabled: false,
                  label: (
                    <a
                      href="#"
                      onClick={() => {
                        trackVisitResources('website');
                        window.open('https://kidsfirstdrc.org/', '_blank');
                      }}
                    >
                      <ExternalLinkIcon {...iconSize} />
                      <Text className={styles.linkText}>
                        {intl.get('layout.main.menu.website')}
                      </Text>
                    </a>
                  ),
                },
                {
                  key: 'documentation',
                  disabled: false,
                  label: (
                    <a
                      href="#"
                      onClick={() => {
                        trackVisitResources('documentation');
                        window.open('https://kidsfirstdrc.org/help-center/', '_blank');
                      }}
                    >
                      <ExternalLinkIcon {...iconSize} />
                      <Text className={styles.linkText}>
                        {intl.get('layout.main.menu.documentation')}
                      </Text>
                    </a>
                  ),
                },
                {
                  type: 'divider',
                },
                {
                  key: 'contact',
                  label: (
                    <a
                      href="#"
                      onClick={() => {
                        trackVisitResources('contact');
                        window.open(`mailto:${SUPPORT_EMAIL}`);
                      }}
                    >
                      <MailOutlined />
                      <Text className={styles.linkText}>
                        {intl.get('layout.main.menu.contact')}
                      </Text>
                    </a>
                  ),
                },
              ],
            }}
          >
            <a
              className={cx(styles.resourcesMenuTrigger, styles.menuTrigger)}
              onClick={(e) => e.preventDefault()}
              href=""
            >
              <LaptopOutlined />
              <span className={styles.resources}>Resources</span>
              <DownOutlined />
            </a>
          </Dropdown>,
          <Dropdown
            key="user-menu"
            trigger={['click']}
            overlay={
              <Menu
                items={[
                  {
                    key: 'email',
                    disabled: true,
                    label: (
                      <Space size={4} className={styles.userMenuEmail}>
                        <Typography.Text>Signed in with</Typography.Text>
                        <Typography.Text strong>
                          {tokenParsed.email || formatProvider(tokenParsed.identity_provider)}
                        </Typography.Text>
                      </Space>
                    ),
                  },
                  {
                    type: 'divider',
                  },
                  {
                    key: 'profile_settings',
                    label: (
                      <Link to={`/profile/settings`}>
                        <Space>
                          <UserOutlined />
                          {intl.get('layout.user.menu.settings')}
                        </Space>
                      </Link>
                    ),
                  },
                  {
                    key: 'logout',
                    label: (
                      <Space>
                        <LogoutOutlined />
                        {intl.get('layout.user.menu.logout')}
                      </Space>
                    ),
                    onClick: () => {
                      trackLogout();
                      dispatch(personaActions.cleanLogout());
                      dispatch(userActions.cleanLogout());
                      window.sessionStorage.clear();
                    },
                  },
                ]}
              />
            }
          >
            <a
              className={cx(styles.userMenuTrigger, styles.menuTrigger)}
              onClick={(e) => e.preventDefault()}
              href=""
            >
              <Gravatar
                circle
                className={styles.userGravatar}
                email={tokenParsed.email || tokenParsed.identity_provider_identity}
              />
              <span className={styles.userName}>{userInfo?.first_name}</span>
              <DownOutlined />
            </a>
          </Dropdown>,
        ]}
        className={styles.mainHeader}
      />
    </>
  );
};

export default Header;
