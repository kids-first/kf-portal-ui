import { SecondaryNavMenu, SecondaryNavContent } from 'uikit/SecondaryNav';
import styled from "react-emotion";
import React from "react";
import {Container} from "../../FileRepoSidebar/ui";
import {withTheme} from "emotion-theming";

import Column from 'uikit/Column';
import EntityActionBar from "../EntityActionBar";

import { Link } from 'react-router-dom';

const MenuWrapper = styled('ul')`
  ${({ theme }) => theme.secondaryNav}
`;

class Holder extends React.Component {

  constructor(props) {

    super(props);

    this.tabIDs = props.children.map( child => child.props.label );

    this.state = {activeTab: this.tabIDs[0]};
  }

  makeTabButtons() {
    return this.tabIDs.map(tabId => {
      //uses a fake Link: we want the same style as a SecondaryNavMenu, and this is the key to it
      return (
        <li onClick={ () => this.setState({activeTab: tabId})}>
          <Link to={'#summary'} className={tabId === this.state.activeTab ? 'active' : ''}>{tabId}</Link>
        </li>
      )
    })
  }

  render() {
    return (
      <div>
        <MenuWrapper>
          {this.makeTabButtons()}
        </MenuWrapper>
        {this.props.children.map(child => {   //https://alligator.io/react/tabs-component/
          if(child.props.label === this.state.activeTab) return child;
          else return undefined;
        })}
      </div>
    )
  }
}

export default withTheme(Holder);