import React from 'react';

import '../../EntityPage.css';

//needs to be a class to use setState to do the hovering. Would do in CSS, but with emotion it's too complicated and hacky
class TabButton extends React.Component {
  state = { hovered: false };

  onClick = () => this.props.clickEvent(this.props.tabId);
  onMouseEnter = () => this.setState({ hovered: true });
  onMouseLeave = () => this.setState({ hovered: false });

  render() {
    const tabId = this.props.tabId;
    const isActive = this.props.isActive;
    const changeColor = isActive || this.state.hovered;
    const rightIcon = this.props.rightIcon;

    //uses a fake Link: we want the same style as a SecondaryNavMenu, and this is the key to it
    return (
      <div
        className={`entityParticipant-tabButton ${changeColor ? 'changeColor' : ''}`}
        onClick={this.onClick}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        {rightIcon ? (
          <div className="rightIcon">
            <div>{tabId}</div>
            <div style={{ marginLeft: '10px' }}>{rightIcon}</div>
          </div>
        ) : (
          tabId
        )}
      </div>
    );
  }
}

export default class Holder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: Array.isArray(props.children) ? props.children[0].key : props.children.key,
    };
  }

  //interesting https://kf-qa.netlify.com/participant/PT_CMB6TASJ#summary
  render() {
    let children;
    let tabIDs;
    //wrap the item in a one-element array if the item is not itself an array
    if (!Array.isArray(this.props.children)) {
      tabIDs = [this.props.children.key];
      children = [this.props.children];
    } else {
      tabIDs = this.props.children.map(child => child.key);
      children = this.props.children;
    }
    const biospecimenIdToData = this.props.biospecimenIdToData;

    return (
      <div>
        <div className="entityParticipant-tabs-container">
          {tabIDs.map(tabId => {
            return (
              <TabButton
                key={tabId}
                clickEvent={tabId => this.setState({ activeTab: tabId })}
                isActive={tabId === this.state.activeTab}
                tabId={tabId}
                rightIcon={(biospecimenIdToData[tabId] || {}).rightIcon}
              />
            );
          })}
        </div>
        <div className="entityParticipant-holder-container">
          {children.find(child => child.key === this.state.activeTab)}
        </div>
      </div>
    );
  }
}
