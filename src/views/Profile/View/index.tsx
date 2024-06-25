import intl from 'react-intl-universal';

import styles from './index.module.css';
import { usePersona } from 'store/persona';
import CommunityProfile from 'components/uiKit/ComunityProfile';
import { Result } from 'antd';

const ProfileView = () => {
  const { personaUserInfo, isLoading } = usePersona();

  if (!isLoading && !personaUserInfo) {
    return (
      <Result
        className={styles.notFoundMember}
        status="404"
        title="404"
        subTitle={intl.get('screen.memberProfile.notFound')}
      />
    );
  }

  return <CommunityProfile profile={personaUserInfo} isOwner={true} loading={isLoading} />;
};

export default ProfileView;
