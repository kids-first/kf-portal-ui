import intl from 'react-intl-universal';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import CommunityMemberProfilePage from '@ferlab/ui/core/pages/CommunityPage/CommunityMemberProfilePage';
import { Alert, Result } from 'antd';
import { AREA_OF_INTEREST_OPTIONS, ROLE_OPTIONS } from 'views/Community/constants';

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
    <>
      {!userInfo?.is_public &&
        !window.sessionStorage.getItem('profileSettings.privateAlertHasBeenClosed') && (
          <Alert
            className={styles.privateAlert}
            type="warning"
            message={
              <>
                {intl.get('screen.memberProfile.privateAlert')}
                <Link to={`/profile/settings`}>
                  {intl.get('screen.memberProfile.settingsPage')}
                </Link>
                .
              </>
            }
            closable
            onClose={() => {
              window.sessionStorage.setItem('profileSettings.privateAlertHasBeenClosed', 'true');
            }}
          />
        )}
      <CommunityMemberProfilePage
        options={{
          roles: ROLE_OPTIONS,
          interests: AREA_OF_INTEREST_OPTIONS,
        }}
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
    </>
  );
};

export default ProfileView;
