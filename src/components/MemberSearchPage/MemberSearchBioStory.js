import React from 'react';
import FormatLabel from 'components/MemberSearchPage/FormatLabel';
import { Typography } from 'antd';

const { Paragraph, Title } = Typography;

const regex = /<\/?em>/gi;

const MemberSearchBioStory = ({ bio, story }) => {
  return (
    <div>
      <Paragraph style={{ color: 'inherit' }}>
        {bio && bio.length > 0 ? (
          <div style={{ paddingBottom: 24 }}>
            <Title level={3} style={{ paddingBottom: 16, marginBottom: 0 }}>
              Member Biography:
            </Title>
            <FormatLabel
              value={bio[0].replace(regex, '')}
              highLightValues={bio}
              key={1}
              index={1}
            />
          </div>
        ) : (
          ''
        )}
        {story && story.length > 0 ? (
          <div>
            <Title level={3} style={{ paddingBottom: 16, marginBottom: 0 }}>
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
      </Paragraph>
    </div>
  );
};

export default MemberSearchBioStory;
