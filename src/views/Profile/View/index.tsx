import intl from 'react-intl-universal';
import { useNavigate } from 'react-router';
import CommunityMemberProfilePage from '@ferlab/ui/core/pages/CommunityPage/CommunityMemberProfilePage';
import { Result } from 'antd';

import banner from 'components/assets/memberHeader.png';
import { useUser } from 'store/user';
import { STATIC_ROUTES } from 'utils/routes';

import styles from './index.module.css';

const ProfileView = () => {
  const navigate = useNavigate();
  const { userInfo, isLoading } = useUser();

  if (!isLoading && !userInfo) {
    return (
      <Result
        className={styles.notFoundMember}
        status="404"
        title="404"
        subTitle={intl.get('screen.memberProfile.notFound')}
      />
    );
  }

  return (
    <CommunityMemberProfilePage
      user={userInfo}
      loading={isLoading}
      banner={{
        background: banner,
        canEditProfile: true,
        navigate: {
          profile: () => navigate(STATIC_ROUTES.PROFILE_SETTINGS),
          community: () => navigate(STATIC_ROUTES.COMMUNITY),
        },
      }}
    />
  );
};

export default ProfileView;
