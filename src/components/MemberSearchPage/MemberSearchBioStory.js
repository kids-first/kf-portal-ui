import React from 'react';
import FormatLabel from 'components/MemberSearchPage/FormatLabel';
import { Divider, Typography } from 'antd';

const { Paragraph } = Typography;

const regex = /<\/?em>/gi;

const MemberSearchBioStory = ({ bio, story }) => {

  return (
    <div>
      <Paragraph style={{ color: 'inherit' }}>
        {bio && bio.length > 0 ? (
          <div>
            <Divider style={{ margin: 5 }} />
            <div style={{ fontStyle: 'italic' }}>Member Biography: &nbsp;</div>
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
            <Divider style={{ margin: 5 }} />
            <div style={{ fontStyle: 'italic' }}>Member Story: &nbsp;</div>
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
