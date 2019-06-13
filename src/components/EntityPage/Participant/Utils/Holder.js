import React from "react";
import {Container} from "../../../FileRepoSidebar/ui";
import { Link } from 'react-router-dom';
import styled from "react-emotion";
import {withTheme} from "emotion-theming";

//taken from secondaryNavMenu
const MenuWrapper = styled('ul')`
  ${({ theme }) => theme.secondaryNav}
`;

class Holder extends React.Component {

  constructor(props) {
    super(props);

    //wrap the item in a one-element array if the item is not itself an array
    if(!(props.children instanceof Array)) {
      this.tabIDs = [props.children.props.label];
      this.children = [props.children];
    } else {
      this.tabIDs = props.children.map( child => child.props.label );
      this.children = props.children;
    }

    this.state = {activeTab: this.tabIDs[0]};
  }

  /**
   * Makes the buttons for the tabs.
   *
   * @param holder This, as it is needed inside a nested class
   * @returns {*|Array|*[]}
   */
  makeTabButtons(holder) {
    return this.tabIDs.map(tabId => {

      const isActive = tabId === this.state.activeTab;

      //needs to be a class to use setState to do the hovering. Would do in CSS, but with emotion it's too complicated and hacky
      class Button extends React.Component {
        constructor(props) {
          super(props);

          this.state = {hovered: false};
        }

        render() {
          //uses a fake Link: we want the same style as a SecondaryNavMenu, and this is the key to it
          return (
            <li
              style={
                {
                  borderRight: (isActive || this.state.hovered) ? "5px solid #e83a9c" : "5px solid transparent"
                }
              }

              onClick={ () => holder.setState({activeTab: tabId})}

              /*
              Would normally use a function to do the toggling, but JS classes are dumb and their "this" is not actually
              their "this" when used inside a call
               */
              onMouseEnter={ () => this.setState({hovered: true}) }

              onMouseLeave={ () => this.setState({hovered: false}) }
            >
              <Link

                style={{borderBottom: "none", margin: "0 auto"}}

                to={'#summary'}

                className={(isActive ? 'active' : '')}>
                {tabId}
              </Link>
            </li>
          )
        }
      }

      return <Button />
    })
  }

  //interesting https://kf-qa.netlify.com/participant/PT_CMB6TASJ#summary
  render() {
    return (
      <div style={{display: "flex", flexDirection: "row"}}>
        <div style={{alignSelf: "flex-start"}}>
          <MenuWrapper style={{flexDirection: "column", display: "inline-block"}}>
            {this.makeTabButtons(this)}
          </MenuWrapper>
        </div>
        <Container>
          {this.props.children.find(child => child.props.label === this.state.activeTab)}
        </Container>
      </div>
    )
  }
}

export default withTheme(Holder);