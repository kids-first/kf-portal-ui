import { css } from 'emotion';

// TODO : REMOVE This file to ensure it is unused

export const cssFileSummaryRoot = theme => css`
  border: solid 1px ${theme.greyScale5};

  button.showDetailsButton {
    border: solid 2px #fff;
    background-color: ${theme.greyScale10};
    font-size: 11px;
    color: ${theme.primary};
    width: 100%;
    font-align: center;
    cursor: pointer;
    padding: 6px;
    // margin: 2px;
  }

  .filePermissions {
    padding: 15px;
  }
  .summary {
    display: flex;
    flex-direction: row;

    .block {
      display: flex;
      flex-direction: row;
    }
  }
  .block {
    flex: 1;
    flex-direction: column;
    padding: 15px;
  }
  .right {
    border-left: solid 1px ${theme.greyScale5};
  }
  .summaryLabel {
    font-size: 13px;
    color: ${theme.greyScale1};
  }
  .summaryValue {
    padding-left: 20px;
  }

  .summaryValue .number {
    font-size: 18px;
    color: ${theme.greyScale1};
    padding: 4px;
  }
  .summaryValue .text {
    font-size: 13px;
    color: ${theme.greyScale9};
    padding: 3px;
  }
  .details {
    display: flex;
    flex-direction: row;
    border-top: solid 1px ${theme.greyScale5};
    .block {
      padding-bottom: 0px;
    }
  }
  .studyDetails {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 1em;
  }
  .studyDetails .number {
    font-weight: 500;
  }
  .studyName {
    padding-right: 25px;
  }
  .studyCount {
    white-space: nowrap;
  }
`;
