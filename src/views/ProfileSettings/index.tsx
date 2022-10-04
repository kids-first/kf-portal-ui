import { Button, Space, Typography } from 'antd';
import { Link } from 'react-router-dom';
import intl from 'react-intl-universal';
import IdentificationCard from './cards/Identification';

import styles from './index.module.scss';
import RoleAndAffiliationCard from './cards/RoleAndAffiliation';
import ResearchInterestsCard from './cards/ResearchInterests';
import LocationCard from './cards/Location';
import { usePersona } from 'store/persona';

const { Title } = Typography;

const ProfileSettings = () => {
  const { personaUserInfo } = usePersona();

  return (
    <div className={styles.profileSettingsWrapper}>
      <Space size={16} direction="vertical" className={styles.profileSettings}>
        <div className={styles.profileSettingsHeader}>
          <Title level={4}>{intl.get('screen.profileSettings.title')}</Title>
          <Link to={`/member/${personaUserInfo?._id}`}>
            <Button type="primary">{intl.get('screen.profileSettings.viewProfile')}</Button>
          </Link>
        </div>
        <Space size={24} direction="vertical" className={styles.cardsWrapper}>
          <IdentificationCard />
          <RoleAndAffiliationCard />
          <LocationCard />
          <ResearchInterestsCard />
        </Space>
      </Space>
    </div>
  );
};

export default ProfileSettings;
