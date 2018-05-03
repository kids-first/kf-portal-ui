import { css } from 'react-emotion';

export default `fileRepoContainer ${css`
  display: flex;
  height: 100%;
  box-sizing: border-box;

  & .tableContainer {
    padding: 30px;
    display: flex;
    flex-direction: column;
    position: relative;
    height: 100%;
    box-sizing: border-box;
    overflow-y: auto;
  }

  & .ReactTable .rt-thead .rt-th.-sort-desc,
  .ReactTable .rt-thead .rt-td.-sort-desc {
    box-shadow: inset 0 -3px 0 0 rgba(64, 76, 154, 0.7);
  }

  & .ReactTable .rt-thead .rt-th.-sort-asc,
  & .ReactTable .rt-thead .rt-td.-sort-asc {
    box-shadow: inset 0 3px 0 0 rgba(64, 76, 154, 0.7);
  }

  & .tableToolbar {
    border-left: solid 1px #e0e1e6;
    border-right: solid 1px #e0e1e6;
  }

  & div.sqon-view {
    flex-grow: 1;
  }
`}`;
