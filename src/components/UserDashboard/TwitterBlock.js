import React, { Component } from 'react';
import styled from 'react-emotion';
import scriptjs from 'scriptjs';
import Spinner from 'react-spinkit';

import Card from 'uikit/Card';

const handle = 'kidsfirstDRC';

const StyledCard = styled(Card)`
  margin: 15px 0 15px 40px;
  padding: 31px 29px 29px 27px;
  height: 440px;

  & #twitter-timeline {
    width: 100%;
  }
`;

class TwitterBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    const timelineEl = document.getElementById('twitter-timeline');

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
              chrome: 'nofooter',
              height: 390,
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
        <div id="twitter-timeline" style={{ display: isLoaded ? 'block' : 'none' }} />
      </StyledCard>
    );
  }
}

export default TwitterBlock;
