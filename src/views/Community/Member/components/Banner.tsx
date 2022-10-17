import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import { STATIC_ROUTES } from 'utils/routes';

import styles from '../index.module.scss';

interface OwnProps {
  isOwnUser: boolean;
}

const Banner = ({ isOwnUser }: OwnProps) => (
  <div className={styles.banner}>
    <div className={styles.bannerActions}>
      <Link to={STATIC_ROUTES.COMMUNITY}>
        <Button className={styles.communityBtn} type="link" icon={<ArrowLeftOutlined />}>
          {intl.get('screen.memberProfile.communityBtn')}
        </Button>
      </Link>
      {/* Disable for now */}
      {isOwnUser && (
        <Link to={STATIC_ROUTES.PROFILE_SETTINGS}>
          <Button type="primary" ghost icon={<EditOutlined />}>
            {intl.get('screen.memberProfile.editProfileBtn')}
          </Button>
        </Link>
      )}
    </div>
  </div>
);

export default Banner;
