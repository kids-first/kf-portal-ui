import React, { Component } from 'react';
import styled from 'react-emotion';

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
      badgeNumber: null,
      currentTabIndex: 0,
      title: '',
      loading: false,
    };

    this.setBadge = this.setBadge.bind(this);
    this.setTitle = this.setTitle.bind(this);
    this.setIndex = this.setIndex.bind(this);
  }

  setBadge(n) {
    if (n !== this.state.badgeNumber) this.setState({ badgeNumber: n });
  }

  setIndex(i) {
    //this.setState({ currentTabIndex: i });
    this.goToSlide(i);
  }

  setTitle(title = this.props.tabs[this.state.currentTabIndex].title) {
    this.setState({ title });
  }

  goToSlide(n) {
    this.slider.slickGoTo(n);
  }

  componentDidMount() {
    this.setTitle();
  }

  componentDidUpdate(prevProps, prevState) {
    // tab has updated
    if (prevState.currentTabIndex !== this.state.currentTabIndex) {
      this.setTitle();
    }
  }

  render() {
    const { loading, currentTabIndex, title, badgeNumber } = this.state;
    const { tabs, inactive, className, scrollable } = this.props;

    const activeTab = tabs[currentTabIndex];

    const childProps = {
      setBadge: this.setBadge,
      setTitle: this.setTitle,
      setIndex: this.setIndex,
    };

    const slickSettings = {
      arrows: false,
      //  onReInit: () => console.log('re init'),
      infinite: false,
      speed: 500,
      slidesToScroll: 1,
      dots: true,
      dotsClass: 'slick-dots',
      customPaging: i => (
        <a>
          <IndexDot active={i === currentTabIndex} />
        </a>
      ),
      appendDots: dots => <Dots>{dots}</Dots>,
      afterChange: x => x, //x => this.setState({ currentTabIndex: x }),
      beforeChange: (current, next) => this.setState({ currentTabIndex: next }),
    };

    // console.log('active tab', activeTab);
    return (
      <div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <CardWrapper className={className} inactive={inactive}>
            <HeaderWrapper inactive={inactive}>
              {activeTab && activeTab.headerComponent ? (
                activeTab.headerComponent(childProps)
              ) : (
                <CardHeader title={title} badge={badgeNumber}>
                  {!inactive &&
                    tabs.map((tab, i) => (
                      <TabMenu
                        key={i}
                        active={i === contentIndex}
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
                </CardHeader>
              )}
            </HeaderWrapper>
            <CardContent scrollable={scrollable}>
              <Slider ref={slider => (this.slider = slider)} {...slickSettings}>
                {this.props.tabs.map((tab, i) => tab.component(childProps))}
              </Slider>
            </CardContent>
            {true ? null : <IndexDot index={currentTabIndex} />}
          </CardWrapper>
        )}
      </div>
    );
  }
}

export default Multicard;
