import React from 'react';
import { TwitterTimelineEmbed } from 'react-twitter-embed';

import Card from 'uikit/Card';

const handle = 'kidsfirstDRC';

const TwitterBlock = () => (
  <Card my="15px" ml="40px" pt="31px" pr="29px" pb="29px" pl="27px" height="440px">
    <TwitterTimelineEmbed sourceType="profile" screenName={handle} options={{ noFooter: true }} />
  </Card>
);

export default TwitterBlock;
