import { SecondaryNavMenu, SecondaryNavContent } from 'uikit/SecondaryNav';
import styled from "react-emotion";
import React from "react";

const MenuWrapper = styled('ul')`
  ${({ theme }) => theme.secondaryNav}
`;

const Buttons = ({tabs}) => {
  return tabs.map( tab => <button onClick={this.setState({ specimenTab: tab.name})}>tab.name</button> );
};

const Tabs = ({tabs}) => {
  
}

const Navs = ({tabs}) => {
  return (
    <MenuWrapper>
      <Buttons tabs={tabs}/>
    </MenuWrapper>)
};



export default Navs;