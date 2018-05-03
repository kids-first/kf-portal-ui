import { css } from 'react-emotion';

export default `afvModalContent ${css`
  flex: 1;
  display: flex;
  height: calc(100% - 175px);
  width: calc(100% - 40px);
  position: absolute;

  .advancedFacetViewWrapper {
    padding: 0px;
  }
  .advancedFacetViewWrapper .facetViewWrapper .treeViewPanel {
    border-bottom: none;
  }

  .advancedFacetViewWrapper * {
    box-sizing: border-box;
  }

  .afvStatContainer .statContainer {
    background: none;
    padding: none;
    border: none;
  }

  .afvStatContainer .statContainer .stat {
    padding-left: 10px;
    padding-right: 10px;
  }
`}`;
