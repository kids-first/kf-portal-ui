import { css } from 'emotion';
export const highLightRow = theme => `
  font-weight: bold;
  color: ${theme.secondary};
  background-color: #edeef1;
  border-bottom: solid 1px ${theme.greyScale5};
`;

export const dataTableStyle = theme =>
  `table ${css`
    border: solid 1px ${theme.greyScale5};
    &.table {
      & .row {
        padding: 15px;
        padding-left: 50px;
        &:first-child {
          ${highLightRow(theme)};
        }
        &:nth-child(2n) {
          background-color: #e4f4f8;
        }
        & .tableCell {
          padding-right: 20px;
          position: relative;
          flex: 1;
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
