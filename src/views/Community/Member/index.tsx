import intl from 'react-intl-universal';
import { useNavigate, useParams } from 'react-router-dom';
import CommunityMemberProfilePage from '@ferlab/ui/core/pages/CommunityPage/CommunityMemberProfilePage';
import {
  AREA_OF_INTEREST,
  AREA_OF_INTEREST_OPTIONS,
  ROLE_OPTIONS,
} from 'views/Community/constants';

import banner from 'components/assets/memberHeader.png';
import useApi from 'hooks/useApi';
import { headers, USER_API_URL } from 'services/api/user';
import { TUser } from 'services/api/user/models';
import { useUser } from 'store/user';
import { STATIC_ROUTES } from 'utils/routes';

const CommunityMember = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userInfo } = useUser();
  const { loading, result: profile } = useApi<TUser>({
    config: {
      url: `${USER_API_URL}/${id}`,
      method: 'GET',
      headers: headers(),
    },
  });

  return (
    <CommunityMemberProfilePage
      user={profile}
      loading={loading}
      options={{
        roles: ROLE_OPTIONS,
        interests: AREA_OF_INTEREST_OPTIONS,
      }}
      dictionary={{
        banner: {
          communityButton: intl.get('screen.memberProfile.communityBtn'),
          editProfile: intl.get('screen.memberProfile.editProfileBtn'),
        },
        profile: {
          interests: {
            noInterest: intl.get('screen.memberProfile.noInterests'),
            title: intl.get('screen.memberProfile.interests'),
          },
          linkedin: intl.get('screen.memberProfile.linkedin'),
          roles: {
            noRole: intl.get('screen.memberProfile.noRoles'),
            title: intl.get('screen.memberProfile.rolesTitle'),
          },
          website: intl.get('screen.memberProfile.website'),
        },
      }}
      banner={{
        background: banner,
        canEditProfile: profile?.id === userInfo?.id,
        navigate: {
          profile: () => navigate(STATIC_ROUTES.PROFILE_SETTINGS),
          community: () => navigate(STATIC_ROUTES.COMMUNITY),
        },
      }}
    />
  );
};

export default CommunityMember;
