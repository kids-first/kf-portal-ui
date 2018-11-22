import React, { Component } from 'react';

import CardHeader from 'uikit/Card/CardHeader';
import CardContent from 'uikit/Card/CardContent';
import { CardWrapper, HeaderWrapper } from 'uikit/Card/styles';
import posed, { PoseGroup } from 'react-pose';
import LoadingSpinner from 'uikit/LoadingSpinner';
import TabMenu from './TabMenu';
import IndexDots from './IndexDots';

const AnimatedChild = posed.div({
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
    const animatedChildren = React.Children.map(this.props.children, (child, i) => (
      <AnimatedChild key={i}>
        {React.cloneElement(child, {
          setBadge: this.setBadge,
          setIndex: this.setIndex,
          setTitle: this.setTitle,
        })}
      </AnimatedChild>
    ));
    this.children = animatedChildren;
    this.setState({ loading: false });
    console.log('children', animatedChildren);
    // setInterval(() => this.setState({ contentIndex: this.state.contentIndex === 0 ? 1 : 0 }), 1500);
  }

  setBadge(n) {
    if (n !== this.state.badgeNumber) this.setState({ badgeNumber: n });
  }

  setIndex(i) {
    this.setState({ contentIndex: i });
  }

  setTitle(title) {
    this.setState({ title });
  }

  render() {
    const { loading, contentIndex, title, badgeNumber } = this.state;
    const { inactive, className, tabMenu, scrollable } = this.props;

    return (
      <div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <CardWrapper className={className} inactive={inactive}>
            <HeaderWrapper inactive={inactive}>
              <CardHeader title={title} badge={badgeNumber}>
                {!inactive &&
                  tabMenu.map((tab, i) => (
                    <TabMenu
                      key={i}
                      active={i === contentIndex}
                      onClick={() => this.setIndex(i)}
                      title={tabMenu[i]}
                    />
                  ))}
              </CardHeader>
            </HeaderWrapper>
            <CardContent scrollable={scrollable}>
              <PoseGroup>{this.children[contentIndex]}</PoseGroup>
            </CardContent>
            <IndexDots index={contentIndex} items={this.children.length} />
          </CardWrapper>
        )}
      </div>
    );
  }
}

export default Multicard;
