import React from 'react';
import styled from 'react-emotion';
import { withTheme } from 'emotion-theming';

export const Container = styled('div')`
  overflow-y: hidden;
  flex-grow: 0;
  flex-shrink: 1;
  width: 100%;
  min-width: 265px;
  height: 100%;
  // background: ${({ theme }) => theme.backgroundGrey};
`;

//needs to be a class to use setState to do the hovering. Would do in CSS, but with emotion it's too complicated and hacky
class TabButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = { hovered: false };
  }

  render() {
    const tabId = this.props.tabId;
    const isActive = this.props.isActive;
    const changeColor = isActive || this.state.hovered;

    //uses a fake Link: we want the same style as a SecondaryNavMenu, and this is the key to it
    return (
      <div
        style={{flexGrow: 0, padding: "10px", marginRight: "5px", marginBottom: "5px",
          border: changeColor ? "thin solid #e83a9c" : "thin solid rgb(224, 225, 230)", borderRadius: "1em"
        }}
        onClick={() => this.props.clickEvent(tabId)}

        onMouseEnter={() => this.setState({ hovered: true })}
        onMouseLeave={() => this.setState({ hovered: false })}
      >
        {tabId}
      </div>
    );
  }
}

class Holder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: Array.isArray(props.children)
        ? props.children[0].props.label
        : props.children.props.label,
    };
  }

  //interesting https://kf-qa.netlify.com/participant/PT_CMB6TASJ#summary
  render() {
    let children;
    let tabIDs;
    //wrap the item in a one-element array if the item is not itself an array
    if (!Array.isArray(this.props.children)) {
      tabIDs = [this.props.children.props.label];
      children = [this.props.children];
    } else {
      tabIDs = this.props.children.map(child => child.props.label);
      children = this.props.children;
    }

    return (
      <div>
        <div style={{display: "flex", flexWrap: "wrap"}}>
          {tabIDs.map(tabId => {
            return (
              <TabButton
                key={tabId}
                clickEvent={tabId => this.setState({ activeTab: tabId })}
                isActive={tabId === this.state.activeTab}
                tabId={tabId}
              />
            );
          })}
        </div>
        <Container>{children.find(child => child.props.label === this.state.activeTab)}</Container>
      </div>
    );
  }
}

export default withTheme(Holder);