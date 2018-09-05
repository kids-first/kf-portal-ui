import React, { Component } from 'react';
import styled from 'react-emotion';
import scriptjs from 'scriptjs';
import { Div } from 'uikit/Core';
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
  state = {
    loaded: false,
  };

  componentDidMount() {
    const setLoaded = () => setTimeout(() => this.setState({ loaded: true }), 1000);

    scriptjs('https://platform.twitter.com/widgets.js', () => {
      const twttr = window.twttr;

      twttr.ready(() => {
        twttr.events.bind('loaded', function(event) {
          console.log('eevent', event);
          setLoaded();
        });

        twttr.widgets
          .createTimeline(
            {
              sourceType: 'profile',
              screenName: handle,
            },
            document.getElementById('twitter-timeline'),
            {
              chrome: 'nofooter',
              height: 390,
            },
          )
          .then(() => twttr.widgets.load());
      });
    });
  }

  render() {
    return (
      <StyledCard>
        <Div id="twitter-timeline" display={!this.state.loaded ? 'none' : 'block'} />
      </StyledCard>
    );
  }
}

export default TwitterBlock;
