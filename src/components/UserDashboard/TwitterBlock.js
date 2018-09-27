import React, { Component } from 'react';
import styled from 'react-emotion';
import scriptjs from 'scriptjs';
import Spinner from 'react-spinkit';
import { withTheme } from 'emotion-theming';

import Card from 'uikit/Card';
import ExternalLink from 'uikit/ExternalLink';
import { Box } from 'uikit/Core';

const StyledCard = styled(Card)`
  margin: 15px 0 15px 40px;
  padding: 21px 29px 29px 27px;
  height: 440px;

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
  }

  componentDidMount() {
    const timelineEl = document.getElementById('twitter-timeline');
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

  renderTwitterTitle() {
    const { handle, theme } = this.props;

    const commonStyle = {
      fontFamily: theme.fonts.default,
      fontWeight: 500,
    };

    const words = [
      {
        text: 'Tweets',
        el: 'span',
        props: {
          style: { ...commonStyle, ...{ fontSize: '20px', color: '#404c9a' } },
        },
      },
      {
        text: 'by',
        el: 'span',
        props: { style: { ...commonStyle, ...{ fontSize: '14px', color: theme.greyScale9 } } },
      },
      {
        text: `@${handle}`,
        el: ExternalLink,
        props: {
          style: { ...commonStyle, ...{ fontSize: '14px', color: theme.primaryLight } },
          hasExternalIcon: false,
          href: `https://twitter.com/@${handle}`,
        },
      },
    ];

    const output = words.map((w, i) => {
      const text = i !== words.length - 1 ? w.text + ' ' : w.text;
      return React.createElement(w.el, w.props, text);
    });

    return <div>{output}</div>;
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
          <Box mb={'21px'}>{this.renderTwitterTitle()}</Box>
          <div id="twitter-timeline" />
        </Box>
      </StyledCard>
    );
  }
}

export default withTheme(TwitterBlock);
