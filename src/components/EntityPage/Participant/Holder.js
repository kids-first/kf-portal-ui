import { SecondaryNavMenu, SecondaryNavContent } from 'uikit/SecondaryNav';
import styled from "react-emotion";
import React, {useState} from "react";
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
          <Link
            style={
              {
                borderBottom: "0px solid transparent",
                width: "100%",
                borderRight: tabId === this.state.activeTab ? '5px solid #e83a9c' : '5px solid transparent',
                textAlign: "center"
              }
            }

            to={'#summary'}

            className={tabId === this.state.activeTab ? 'active' : ''}>
              {tabId}
          </Link>
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

  //interesting https://kf-qa.netlify.com/participant/PT_CMB6TASJ#summary

  render() {
    return (
      <div style={{display: "flex", flexDirection: "row"}}>
        <div style={{alignSelf: "flex-start"}}>
          <MenuWrapper style={{flexDirection: "column", display: "inline-block"}}>
            {this.makeTabButtons()}
          </MenuWrapper>
        </div>
        <Container>
          {this.makeTabs()}
        </Container>
      </div>
    )
  }
}

export default withTheme(Holder);