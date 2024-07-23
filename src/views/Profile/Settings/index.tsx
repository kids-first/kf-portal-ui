import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import { Button, Space, Typography } from 'antd';

import IdentificationCard from './cards/Identification';
import LocationCard from './cards/Location';
import ResearchInterestsCard from './cards/ResearchInterests';
import RoleAndAffiliationCard from './cards/RoleAndAffiliation';

import styles from './index.module.css';

const { Title } = Typography;

const ProfileSettings = () => (
  <div className={styles.profileSettingsWrapper}>
    <Space size={16} direction="vertical" className={styles.profileSettings}>
      <div className={styles.profileSettingsHeader}>
        <Title level={4}>{intl.get('screen.profileSettings.title')}</Title>
        <Link to={`/profile/view`}>
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

export default ProfileSettings;
