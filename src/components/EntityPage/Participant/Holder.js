import { SecondaryNavMenu, SecondaryNavContent } from 'uikit/SecondaryNav';
import styled from "react-emotion";
import React from "react";
import {Container} from "../../FileRepoSidebar/ui";
import {withTheme} from "emotion-theming";

import Column from 'uikit/Column';
import EntityActionBar from "../EntityActionBar";

import { Link } from 'react-router-dom';

//taken from secondaryNavMenu
const MenuWrapper = styled('ul')`
  ${({ theme }) => theme.secondaryNav}
`;

class Holder extends React.Component {

  constructor(props) {
    super(props);

    if(!(props.children instanceof Array)) this.tabIDs = [props.children.props.label];
    else this.tabIDs = props.children.map( child => child.props.label );

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

  makeTabs() {
    if(this.props.children instanceof Array) {
      return this.props.children.map(child => {   //https://alligator.io/react/tabs-component/
        if(child.props.label === this.state.activeTab) return child;
        else return undefined;
      })
    } else {
      window.console.log("test ")
      window.console.log(this.props.children)

      return this.props.children
    }
  }

  //TODO handle case not array
  render() {
    return (
      <div>
        <MenuWrapper>
          {this.makeTabButtons()}
        </MenuWrapper>
        <Container>
          {this.makeTabs()}
        </Container>
      </div>
    )
  }
}

export default withTheme(Holder);