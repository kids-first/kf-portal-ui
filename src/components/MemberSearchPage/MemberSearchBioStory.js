import React from 'react';
import FormatLabel from 'components/MemberSearchPage/FormatLabel';
import { Typography } from 'antd';

const { Title } = Typography;

const regex = /<\/?em>/gi;

const MemberSearchBioStory = ({ bio, story }) => {
  return (
    <div>
      {bio && bio.length > 0 ? (
        <div style={{ color: 'inherit', paddingTop: 24, marginBottom: 0 }}>
          <Title
            className={'member-info-title'}
            level={3}
            style={{ marginBottom: 0, paddingBottom: 16 }}
          >
            Member Biography:
          </Title>
          <FormatLabel value={bio[0].replace(regex, '')} highLightValues={bio} key={1} index={1} />
        </div>
      ) : (
        ''
      )}
      {story && story.length > 0 ? (
        <div>
          <Title
            className={'member-info-title'}
            level={3}
            style={{ marginBottom: 0, paddingTop: 24, paddingBottom: 16 }}
          >
            Member Story:
          </Title>
          <FormatLabel
            value={story[0].replace(regex, '')}
            highLightValues={story}
            key={2}
            index={2}
          />
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default MemberSearchBioStory;
