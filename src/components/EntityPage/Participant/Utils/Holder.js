import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'react-emotion';
import { withTheme } from 'emotion-theming';

//taken from secondaryNavMenu
const MenuWrapper = styled('ul')`
  ${({ theme }) => theme.secondaryNav}
  border: 1px solid transparent;
`;

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

    //uses a fake Link: we want the same style as a SecondaryNavMenu, and this is the key to it
    return (
      <li
        style={{
          borderRight:
            isActive || this.state.hovered ? '5px solid #e83a9c' : '5px solid transparent',
        }}
        onClick={() => this.props.clickEvent(tabId)}
        /*
        Would normally use a function to do the toggling, but JS classes are dumb and their "this" is not actually
        their "this" when used inside a call
         */
        onMouseEnter={() => this.setState({ hovered: true })}
        onMouseLeave={() => this.setState({ hovered: false })}
      >
        <Link
          style={{ borderBottom: 'none', marginLeft: '-40px' }}
          to={'#summary'}
          className={isActive ? 'active' : ''}
        >
          {tabId}
        </Link>
      </li>
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
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ alignSelf: 'flex-start' }}>
          <MenuWrapper
            style={{
              flexDirection: 'column',
              display: 'inline-block',
            }}
          >
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
          </MenuWrapper>
        </div>
        <Container>{children.find(child => child.props.label === this.state.activeTab)}</Container>
      </div>
    );
  }
}

export default withTheme(Holder);
