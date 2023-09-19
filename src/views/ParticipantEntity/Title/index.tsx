import { UserOutlined } from '@ant-design/icons';
import { EntityTitle } from '@ferlab/ui/core/pages/EntityPage';
import { Space } from 'antd';
import { IParticipantEntity } from 'graphql/participants/models';

import DownloadClinicalDataDropdown from 'components/reports/DownloadClinicalDataDropdown';

interface OwnProps {
  participant?: IParticipantEntity;
  loading?: boolean;
}

const ParticipantEntityTitle: React.FC<OwnProps> = ({ participant, loading }) => {
  const title = {
    text: participant?.participant_id,
    icon: <UserOutlined />,
    extra: (
      <Space>
        {participant && (
          <DownloadClinicalDataDropdown
            participantIds={[participant.participant_id]}
            type="primary"
          />
        )}
      </Space>
    ),
  };

  return <EntityTitle {...title} loading={loading} />;
};

export default ParticipantEntityTitle;
