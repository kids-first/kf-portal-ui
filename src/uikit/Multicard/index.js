import React, { Component } from 'react';

import CardHeader from 'uikit/Card/CardHeader';
import CardContent from 'uikit/Card/CardContent';
import { CardWrapper, HeaderWrapper } from 'uikit/Card/styles';
import posed, { PoseGroup } from 'react-pose';
import LoadingSpinner from 'uikit/LoadingSpinner';
import TabMenu from './TabMenu';

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
    console.log('render', this.props.children);
    const { loading, contentIndex, title, badgeNumber } = this.state;
    const { inactive, className, tabMenu } = this.props;
    console.log('props', this.props);
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
            <CardContent>
              <PoseGroup>{this.children[contentIndex]}</PoseGroup>
            </CardContent>
          </CardWrapper>
        )}
      </div>
    );
  }
}

export default Multicard;
