import intl from 'react-intl-universal';
import { CloseOutlined } from '@ant-design/icons';
import { useKeycloak } from '@react-keycloak/web';
import { Modal, Space, Typography } from 'antd';
import LandingPageButton from 'views/LandingPage/Components/LandingPageButton';

import { REDIRECT_URI_KEY } from 'common/constants';
import logo from 'components/assets/logo.svg';
import useQueryParams from 'hooks/useQueryParams';
import { trackPublicStudies } from 'services/analytics';
import { STATIC_ROUTES } from 'utils/routes';

import style from './index.module.css';

const { Title, Paragraph } = Typography;

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
  redirectUri?: string;
};

const LoginModal = ({ isOpen, onClose, redirectUri }: LoginModalProps) => {
  const { keycloak } = useKeycloak();
  const query = useQueryParams();

  const handleSignin = async (btnName: string) => {
    trackPublicStudies(btnName);
    const url = keycloak.createLoginUrl({
      redirectUri: `${window.location.origin}/${
        redirectUri || query.get(REDIRECT_URI_KEY) || STATIC_ROUTES.DASHBOARD
      }`,
      locale: intl.getInitOptions().currentLocale,
    });
    window.location.assign(url);
  };

  return (
    <Modal
      closable
      closeIcon={
        <div className={style.closeBtn}>
          <CloseOutlined className={style.closeIcon} />
          {intl.get('screen.publicStudies.loginModal.close')}
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      className={style.modal}
    >
      <div className={style.contentWrapper}>
        <img className={style.logo} src={logo} alt="kids-first-logo" />
        <Title className={style.title}>{intl.get('screen.publicStudies.loginModal.title')}</Title>
        <div>
          <Paragraph className={style.text}>
            {intl.get('screen.publicStudies.loginModal.text1')}
          </Paragraph>
          <Paragraph className={style.text}>
            {intl.get('screen.publicStudies.loginModal.text2')}
          </Paragraph>
          <Paragraph className={style.subtext}>
            {intl.get('screen.publicStudies.loginModal.text3')}
          </Paragraph>
        </div>
        <Space size={24}>
          <LandingPageButton alt onClick={() => handleSignin('Modal Login')} size="large">
            {intl.get('screen.publicStudies.loginModal.login')}
          </LandingPageButton>
          <LandingPageButton onClick={() => handleSignin('Modal Sign up')} size="large">
            {intl.get('screen.publicStudies.loginModal.signup')}
          </LandingPageButton>
        </Space>
      </div>
    </Modal>
  );
};

export default LoginModal;
