import { useNavigate, useParams } from 'react-router-dom';
import CommunityMemberProfilePage from '@ferlab/ui/core/pages/CommunityPage/CommunityMemberProfilePage';

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
