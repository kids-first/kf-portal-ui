import React, { Component } from 'react';

import Row from 'uikit/Row';
import CardHeader from 'uikit/Card/CardHeader';
import CardContent from 'uikit/Card/CardContent';
import { CardWrapper, HeaderWrapper } from 'uikit/Card/styles';
import './slick/slick.min.css';
import Slider from 'react-slick';
import LoadingSpinner from 'uikit/LoadingSpinner';
import TabMenu from './TabMenu';
import IndexDots from './IndexDots';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';

class Multicard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTabIndex: 0,
      title: '',
      loading: false,
    };

    this.setTitle = this.setTitle.bind(this);
    this.setIndex = this.setIndex.bind(this);

    this.childProps = {
      setTitle: this.setTitle,
      setIndex: this.setIndex,
    };
  }

  setIndex(i) {
    //this.setState({ currentTabIndex: i });
    this.slider.slickGoTo(i);
  }

  setTitle(title = this.props.tabs[this.state.currentTabIndex].title) {
    this.setState({ title });
  }

  componentDidMount() {
    this.setTitle();
  }

  componentDidUpdate(prevProps, prevState) {
    const previousTabIndex = prevState.currentTabIndex;
    const currentTabIndex = this.state.currentTabIndex;

    // tab has updated
    if (previousTabIndex !== currentTabIndex) {
      this.setTitle();

      const tabs = this.props.tabs;
      const prevTabOnExit = tabs[previousTabIndex].onExit;
      const currentTabOnEnter = tabs[currentTabIndex].onEnter;
      if (prevTabOnExit) prevTabOnExit(this.childProps, previousTabIndex, currentTabIndex);
      if (currentTabOnEnter) currentTabOnEnter(this.childProps, previousTabIndex, currentTabIndex);
    }
  }

  render() {
    const { loading, currentTabIndex, title } = this.state;
    const { tabs, inactive, className, scrollable } = this.props;

    const activeTab = tabs[currentTabIndex];

    const slickSettings = {
      draggable: false,
      arrows: false,
      infinite: false,
      speed: 380,
      slidesToScroll: 1,
      dots: false,
      beforeChange: (current, next) => {
        this.setState({ currentTabIndex: next });
      },
    };

    return (
      <div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <CardWrapper className={className} inactive={inactive}>
            <HeaderWrapper inactive={inactive}>
              {activeTab && activeTab.headerComponent ? (
                activeTab.headerComponent(this.childProps)
              ) : (
                <CardHeader title={title} />
              )}
              <Row>
                {!inactive &&
                  tabs.map((tab, i) => (
                    <TabMenu
                      key={i}
                      active={i === currentTabIndex}
                      onClick={() => this.setIndex(i)}
                      title={tab.nav}
                    />
                  ))}
              </Row>
            </HeaderWrapper>
            <CardContent scrollable={scrollable}>
              <Slider ref={slider => (this.slider = slider)} {...slickSettings}>
                {tabs.map((tab, i) => tab.component(this.childProps))}
              </Slider>
            </CardContent>
            {inactive ? null : (
              <IndexDots index={currentTabIndex} items={tabs.length} setIndex={this.setIndex} />
            )}
          </CardWrapper>
        )}
      </div>
    );
  }
}

export default Multicard;
