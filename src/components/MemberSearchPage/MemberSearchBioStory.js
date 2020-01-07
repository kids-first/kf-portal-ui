import React from 'react';
import FormatLabel from 'components/MemberSearchPage/FormatLabel';

const regex = /<\/?em>/gi;

const MemberSearchBioStory = ({ bio, story }) => {
  return (
    <div>
      {bio && bio.length > 0 ? (
        <div style={{ color: 'inherit', paddingTop: 24, marginBottom: 0 }}>
          <FormatLabel
            value={bio[0].replace(regex, '')}
            highLightValues={bio}
            key={1}
            index={1}
            prepend={'Member Biography:'}
          />
        </div>
      ) : (
        ''
      )}
      {story && story.length > 0 ? (
        <div style={{ color: 'inherit', paddingTop: 24, marginBottom: 0 }}>
          <FormatLabel
            value={story[0].replace(regex, '')}
            highLightValues={story}
            key={2}
            index={2}
            prepend={'Member Story:'}
          />
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default MemberSearchBioStory;
