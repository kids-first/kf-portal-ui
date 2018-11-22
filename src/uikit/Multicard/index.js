import React, { Component } from 'react';

import CardContent from 'uikit/Card/CardContent';
import CardHeader from 'uikit/Card/CardHeader';
import { CardWrapper } from 'uikit/Card/styles';
import posed, { PoseGroup } from 'react-pose';
import LoadingSpinner from 'uikit/LoadingSpinner';

const Box = posed.div({
  enter: {
    y: 0,
    opacity: 1,
  },
  exit: {
    y: 50,
    opacity: 0,
    transition: { duration: 150 },
  },
});

class Multicard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      badgeNumber: null,
      contentIndex: 0,
      title: '',
      loading: true,
    };

    this.setBadge = this.setBadge.bind(this);
    this.setTitle = this.setTitle.bind(this);
    this.setIndex = this.setIndex.bind(this);
  }

  componentDidMount() {
    console.log('CDM');
    const animatedChildren = React.Children.map(this.props.children, (child, i) => (
      <Box key={i}>
        {React.cloneElement(child, {
          setBadge: this.setBadge,
          setIndex: this.setIndex,
          setTitle: this.setTitle,
        })}
      </Box>
    ));
    this.children = animatedChildren;
    this.setState({ loading: false });
    console.log('children', animatedChildren);
    // setInterval(() => this.setState({ contentIndex: this.state.contentIndex === 0 ? 1 : 0 }), 1500);
  }

  setBadge(n) {
    console.log('set badge', n);
    if (n !== this.state.badgeNumber) this.setState({ badgeNumber: n });
  }

  setIndex(i) {
    console.log('set index', i);
    this.setState({ contentIndex: i });
  }

  setTitle(title) {
    console.log('set title', title);
    this.setState({ title });
  }

  render() {
    console.log('render');
    const { loading, contentIndex } = this.state;
    return (
      <div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <CardWrapper>
            <PoseGroup>{this.children[contentIndex]}</PoseGroup>
          </CardWrapper>
        )}
      </div>
    );
  }
}

export default Multicard;
