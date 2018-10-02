import React, { Component } from 'react';
import styled from 'react-emotion';
import scriptjs from 'scriptjs';
import Spinner from 'react-spinkit';
import { withTheme } from 'emotion-theming';

import Card from 'uikit/Card';
import { Box } from 'uikit/Core';
import TwitterHeading from './TwitterHeading';

const StyledCard = styled(Card)`
  margin: 15px 0 15px 40px;
  padding: 21px 29px 29px 27px;
  flex-direction: column;

  & #twitter-timeline {
    width: 100%;
    height: 100%;
    padding-bottom: 66px;
  }
`;

class TwitterBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
    this.timeline = React.createRef();
  }

  componentDidMount() {
    const timelineEl = this.timeline.current;
    const handle = this.props.handle;

    scriptjs('https://platform.twitter.com/widgets.js', () => {
      const twttr = window.twttr;

      twttr.ready(() => {
        twttr.widgets
          .createTimeline(
            {
              sourceType: 'profile',
              screenName: handle,
            },
            timelineEl,
            {
              chrome: 'nofooter noheader',
              height: '100%',
            },
          )
          .then(() => {
            twttr.widgets.load(timelineEl);
            this.setState({ loaded: true });
          });
      });
    });
  }

  render() {
    const isLoaded = this.state.loaded;

    return (
      <StyledCard>
        <Spinner
          fadeIn="none"
          name="circle"
          color="purple"
          style={{
            width: 15,
            height: 15,
            margin: '20px auto',
            padding: 5,
            display: !isLoaded ? 'block' : 'none',
          }}
        />

        <Box height="100%" style={{ display: isLoaded ? 'block' : 'none' }}>
          <TwitterHeading handle={this.props.handle} mb={'21px'} />
          <div id="twitter-timeline" ref={this.timeline} />
        </Box>
      </StyledCard>
    );
  }
}

export default withTheme(TwitterBlock);
