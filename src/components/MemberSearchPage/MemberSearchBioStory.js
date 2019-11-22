import React, { Component } from 'react';
import FormatLabel from 'components/MemberSearchPage/FormatLabel';
import { Typography } from 'antd';
import { bind } from '../../utils';
import PropTypes from 'prop-types';

const { Paragraph } = Typography;

const regex = /<\/?em>/gi;

const MemberSearchBioStory = ({ bio, story }) => {
  // static propTypes = {
  //   highlights: PropTypes.array.isRequired,
  // };

  return (
    <div>
      <Paragraph style={{ color: 'inherit' }}>
        {bio ? (
          <div>
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
        {story ? (
          <div>
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
