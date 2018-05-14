import { css } from 'emotion';

const coloredRow = theme => `
  background-color: ${theme.greyScale10};
`;

export const dataTableStyle = ({ theme, reverseColor }) =>
  `table ${css`
    &.table {
      border: solid 1px ${theme.greyScale5};
      &.total {
        & .row:first-child {
          background-color: ${theme.optionSelected};
          color: black;
        }
      }
      & .row {
        padding: 15px;
        padding-left: 50px;
        &:nth-child(${reverseColor ? `2n + 1` : `2n`}) {
          ${coloredRow(theme)};
        }
        &:first-child {
          font-weight: bold;
          color: ${theme.secondary};
          background-color: #edeef1;
          border-bottom: solid 1px ${theme.greyScale5};
        }
        &.selected {
          background-color: ${theme.optionSelected};
        }
        & .tableCell {
          padding-right: 20px;
          position: relative;
          flex: 1;
          & .checkMark {
            width: 20px;
            height: 20px;
            margin-right: 13px;
          }
          & .checkbox {
            margin-right: 20px;
          }
          & .left {
            position: absolute;
            right: 100%;
          }
        }
        &:not(:first-child) {
          & .tableCell {
            &:first-child {
              font-weight: bold;
            }
          }
        }
      }
    }
  `}`;

export const totalRowStyle = theme =>
  `totalRow ${css`
    &.totalRow {
      ${coloredRow(theme)};
      justify-content: space-between;
      padding: 15px;
      padding-left: 50px;
      & .tableCell {
        display: flex;
        flex: 1;
      }
    }
  `}`;

export const modalContentStyle = theme =>
  `familyManifestModal ${css`
     {
      &.familyManifestModal {
        & .modalSubHeader {
          font-family: Montserrat;
          font-weight: 400;
          font-size: 18px;
          & .highlight {
            font-weight: bold;
            color: ${theme.secondary};
          }
        }
      }
    }
  `}`;
