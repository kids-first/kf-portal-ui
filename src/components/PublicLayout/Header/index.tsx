import { useState } from 'react';
import intl from 'react-intl-universal';
import {
  DownOutlined,
  FileSearchOutlined,
  HomeOutlined,
  LaptopOutlined,
  LoginOutlined,
  MailOutlined,
  ReadOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useKeycloak } from '@react-keycloak/web';
import { Button, Dropdown, PageHeader, Typography } from 'antd';
import cx from 'classnames';

import { REDIRECT_URI_KEY } from 'common/constants';
import ExternalLinkIcon from 'components/Icons/ExternalLinkIcon';
import KidsFirstIcon from 'components/Icons/KidsFirstIcon';
import LineStyleIcon from 'components/Icons/LineStyleIcon';
import GradientAccent from 'components/uiKit/GradientAccent';
import useQueryParams from 'hooks/useQueryParams';
import { trackPublicStudies, trackVisitResources } from 'services/analytics';
import { SUPPORT_EMAIL } from 'store/report/thunks';
import { STATIC_ROUTES } from 'utils/routes';

import LoginModal from '../LoginModal';

import HeaderButton from './HeaderButton';

import style from './index.module.css';

const iconSize = { width: 14, height: 14 };

const { Text } = Typography;

const Header = () => {
  const { keycloak } = useKeycloak();
  const query = useQueryParams();

  const [openLoginModal, setOpenLoginModal] = useState(false);
  const closeLoginModal = () => setOpenLoginModal(false);

  const handleSignin = async (btnName: string) => {
    trackPublicStudies(btnName);
    const url = keycloak.createLoginUrl({
      redirectUri: `${window.location.origin}/${
        query.get(REDIRECT_URI_KEY) || STATIC_ROUTES.DASHBOARD
      }`,
      locale: intl.getInitOptions().currentLocale,
    });
    window.location.assign(url);
  };

  return (
    <>
      <GradientAccent isFixed />
      <PageHeader
        title={<KidsFirstIcon className={style.logo} />}
        subTitle={
          <nav className={style.headerList}>
            <HeaderButton
              key="dashboard"
              icon={<HomeOutlined />}
              onClick={() => {
                trackPublicStudies('Dashboard');
                setOpenLoginModal(true);
              }}
              title={intl.get('layout.main.menu.dashboard')}
            />
            <HeaderButton
              key="studies"
              icon={<ReadOutlined />}
              isActive={true}
              title={intl.get('layout.main.menu.studies')}
            />
            <HeaderButton
              key="explore-data"
              icon={<FileSearchOutlined />}
              onClick={() => {
                trackPublicStudies('Data Exploration');
                setOpenLoginModal(true);
              }}
              title={intl.get('layout.main.menu.explore')}
            />
            <HeaderButton
              key="variant-data"
              icon={<LineStyleIcon />}
              onClick={() => {
                trackPublicStudies('Variants');
                setOpenLoginModal(true);
              }}
              title={intl.get('layout.main.menu.variants')}
            />
          </nav>
        }
        extra={[
          <HeaderButton
            key="community"
            icon={<TeamOutlined />}
            onClick={() => {
              trackPublicStudies('Community');
              setOpenLoginModal(true);
            }}
            title={intl.get('layout.main.menu.community')}
          />,
          <Dropdown
            key="resources"
            trigger={['click']}
            overlayClassName={style.dropdown}
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
                      <Text className={style.linkText}>{intl.get('layout.main.menu.website')}</Text>
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
                      <Text className={style.linkText}>
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
                      <Text className={style.linkText}>{intl.get('layout.main.menu.contact')}</Text>
                    </a>
                  ),
                },
              ],
            }}
          >
            <a
              className={cx(style.resourcesMenuTrigger, style.menuTrigger)}
              onClick={(e) => e.preventDefault()}
              href=""
            >
              <LaptopOutlined />
              <span className={style.resources}>Resources</span>
              <DownOutlined />
            </a>
          </Dropdown>,
          <div className={style.connectionWrapper}>
            <HeaderButton
              className={style.loginBtn}
              key="login"
              icon={<LoginOutlined />}
              onClick={() => handleSignin('Login')}
              title={intl.get('screen.loginPage.login')}
            />
            <Button
              className={style.signUpBtn}
              onClick={() => handleSignin('Sign Up')}
              type="primary"
            >
              {intl.get('screen.loginPage.signup')}
            </Button>
          </div>,
        ]}
        className={style.mainHeader}
      />
      {openLoginModal && <LoginModal isOpen={openLoginModal} onClose={closeLoginModal} />}
    </>
  );
};

export default Header;
