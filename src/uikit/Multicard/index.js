import React, { Component } from 'react';

import CardHeader from 'uikit/Card/CardHeader';
import CardContent from 'uikit/Card/CardContent';
import { CardWrapper, HeaderWrapper } from 'uikit/Card/styles';
// import posed from 'react-pose';
import LoadingSpinner from 'uikit/LoadingSpinner';
import TabMenu from './TabMenu';
import IndexDots from './IndexDots';

// const AnimatedChild = posed.div({
//   enter: {
//     y: 0,
//     opacity: 1,
//   },
//   exit: {
//     y: 50,
//     opacity: 0,
//     transition: { duration: 150 },
//   },
// });

class Multicard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      badgeNumber: null,
      contentIndex: 0,
      title: '',
      loading: false,
    };

    this.setBadge = this.setBadge.bind(this);
    this.setTitle = this.setTitle.bind(this);
    this.setIndex = this.setIndex.bind(this);
  }

  /*
  componentDidMount() {
    // Animation to be added
    const animatedChildren = React.Children.map(this.props.children, (child, i) => (
      <AnimatedChild key={i}>{React.cloneElement(child)}</AnimatedChild>
    ));
    this.children = animatedChildren;
    this.setState({ loading: false });
    console.log('children', animatedChildren);
    setInterval(() => this.setState({ contentIndex: this.state.contentIndex === 0 ? 1 : 0 }), 1500);
  }
  */

  setBadge(n) {
    if (n !== this.state.badgeNumber) this.setState({ badgeNumber: n });
  }

  setIndex(i) {
    this.setState({ contentIndex: i });
  }

  setTitle(title = this.props.tabs[this.state.contentIndex].title) {
    this.setState({ title });
  }

  componentDidMount() {
    this.setTitle();
  }

  componentDidUpdate(prevProps, prevState) {
    // tab has updated
    if (prevState.contentIndex !== this.state.contentIndex) {
      this.setTitle();
    }
  }

  render() {
    const { loading, contentIndex, title, badgeNumber } = this.state;
    const { tabs, inactive, className, scrollable } = this.props;

    const activeTab = tabs[contentIndex];
    const childProps = {
      setBadge: this.setBadge,
      setTitle: this.setTitle,
      setIndex: this.setIndex,
    };

    return (
      <div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <CardWrapper className={className} inactive={inactive}>
            <HeaderWrapper inactive={inactive}>
              {activeTab.headerComponent ? (
                activeTab.headerComponent(childProps)
              ) : (
                <CardHeader title={title} badge={badgeNumber}>
                  {!inactive &&
                    tabs.map((tab, i) => (
                      <TabMenu
                        key={i}
                        active={i === contentIndex}
                        onClick={() => this.setIndex(i)}
                        title={tab.nav}
                      />
                    ))}
                </CardHeader>
              )}
            </HeaderWrapper>
            <CardContent scrollable={scrollable}>{activeTab.component(childProps)}</CardContent>
            {inactive ? null : <IndexDots index={contentIndex} items={tabs.length} />}
          </CardWrapper>
        )}
      </div>
    );
  }
}

export default Multicard;
