import React, { Component } from 'react';

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
      contentIndex: 0,
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
              <Slider>{this.props.tabs.map((tab, i) => tab.component(childProps))}</Slider>
            </CardContent>
            {inactive ? null : <IndexDots index={contentIndex} items={tabs.length} />}
          </CardWrapper>
        )}
      </div>
    );
  }
}

export default Multicard;
