import { getFTEnvVarByKey } from 'helpers/EnvVariables';
import { GradientHeader } from 'views/LandingPage/TopBanner/GradientHeader';
import { LoginForm } from 'views/LandingPage/TopBanner/LoginForm';

import { AlterTypes } from 'common/types';
import NotificationBanner from 'components/featureToggle/NotificationBanner';

import styles from './index.module.css';

const FT_FLAG_KEY = 'SITE_WIDE_BANNER';
const BANNER_TYPE_KEY = FT_FLAG_KEY + '_TYPE';
const BANNER_MSG_KEY = FT_FLAG_KEY + '_MSG';
const BANNER_PERSISTENT_KEY = FT_FLAG_KEY + '_PERSISTENT';

const TopBanner = () => (
  <>
    <NotificationBanner
      featureToggleKey={FT_FLAG_KEY}
      type={getFTEnvVarByKey<AlterTypes>(BANNER_TYPE_KEY, 'warning')}
      message={getFTEnvVarByKey(BANNER_MSG_KEY)}
      banner
      closable={getFTEnvVarByKey(BANNER_PERSISTENT_KEY) === 'false'}
    />
    <div className={styles.topBanner}>
      <div className={styles.contentContainer}>
        <LoginForm />
        <GradientHeader />
      </div>
    </div>
  </>
);

export default TopBanner;
