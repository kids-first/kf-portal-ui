import { css } from 'emotion';
export const highLightRow = theme => `
  background-color: #e4f4f8;
`;

export const dataTableStyle = theme =>
  `table ${css`
    border: solid 1px ${theme.greyScale5};
    &.table {
      & .row {
        padding: 15px;
        padding-left: 50px;
        &:first-child {
          font-weight: bold;
          color: ${theme.secondary};
          background-color: #edeef1;
          border-bottom: solid 1px ${theme.greyScale5};
        }
        &:nth-child(2n) {
          ${highLightRow};
        }
        & .tableCell {
          padding-right: 20px;
          position: relative;
          flex: 1;
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
