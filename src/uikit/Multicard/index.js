import React, { Component, Fragment } from 'react';
import Slider from 'react-slick';

import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';

import Row from 'uikit/Row';
import CardHeader from 'uikit/Card/CardHeader';
import CardContent from 'uikit/Card/CardContent';
import { CardWrapper, HeaderWrapper } from 'uikit/Card/styles';
import LoadingSpinner from 'uikit/LoadingSpinner';

import TabMenu from './TabMenu';
import IndexDots from './IndexDots';

// for react-slick
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

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
      className: scrollable ? 'card-slick-scrollable' : '',
    };

    return (
      <div style={{ height: '100%' }}>
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
                      onClick={() => {
                        this.setIndex(i);
                        trackUserInteraction({
                          category: TRACKING_EVENTS.categories.user.dashboard.widgets._multiCard,
                          action: `Tab: ${TRACKING_EVENTS.actions.click}`,
                          label: JSON.stringify({ card: title, tab: tab.nav }),
                        });
                      }}
                      title={tab.nav}
                    />
                  ))}
              </Row>
            </HeaderWrapper>
            <CardContent scrollable={scrollable}>
              <Slider ref={slider => (this.slider = slider)} {...slickSettings}>
                {tabs.map((tab, i) => (
                  <Fragment key={i}>{tab.component(this.childProps)}</Fragment>
                ))}
              </Slider>
            </CardContent>
            {inactive ? null : (
              <IndexDots index={currentTabIndex} items={tabs} setIndex={this.setIndex} />
            )}
          </CardWrapper>
        )}
      </div>
    );
  }
}

export default Multicard;
