import intl from 'react-intl-universal';
import { useParams } from 'react-router-dom';
import { Result } from 'antd';
import { useMemberProfile } from 'graphql/members/actions';

import CommunityProfile from 'components/uiKit/ComunityProfile';
import { usePersona } from 'store/persona';

import styles from './index.module.scss';

const CommunityMember = () => {
  const { id } = useParams<{ id: string }>();
  const { personaUserInfo, isLoading: personaLoading } = usePersona();
  const { loading: profileLoading, profile } = useMemberProfile(id);
  const isOwner = personaUserInfo?._id === id;

  if (!profileLoading && !profile) {
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
    <CommunityProfile
      profile={profile}
      isOwner={isOwner}
      loading={profileLoading || personaLoading}
    />
  );
};

export default CommunityMember;
