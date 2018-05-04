import { css } from 'emotion';

export default ({ theme, profileColors }) => {
  const borderGrey = `#a9adc0`;
  return `${css`
    &.mySavedQueries {
      display: flex;
      flex-direction: column;
      margin-top: 15px;
      flex: 3;
      border: 1px solid ${theme.greyScale5};
      border-top: 0;
      border-bottom-right-radius: 10px;
      border-bottom-left-radius: 10px;
      padding: 0 10px;
      & .gradientBar {
        display: block;
        width: calc(100% + 22px);
        margin-left: -11px;
        height: 6px;
        background-image: linear-gradient(
          to right,
          ${profileColors.gradientDark},
          ${profileColors.gradientMid} 51%,
          ${profileColors.gradientLight}
        );
      }
      & .header {
        display: flex;
        flex-grow: 1;
        padding: 10px 20px 30px;
        display: flex;
        align-items: center;
        &.hascontent {
          border-bottom: 2px dotted ${borderGrey};
        }
        & .queryCount {
          margin-left: auto;
          align-items: center;
          display: flex;
          align-items: baseline;
          & .queryCountNumber {
            font-size: 20px;
            padding: 0 6px 0 9px;
            font-size: 22px;
          }
          & .label {
            font-size: 14px;
            color: ${borderGrey};
          }
        }
        & .saveIcon {
          width: 16px;
          color: ${borderGrey};
        }
      }
      & .queriesListContainer {
        overflow: auto;
        margin: 6px 0 16px;
        & .queriesListItem {
          display: flex;
          padding: 10px 10px 10px 25px;
          border: 1px solid ${theme.greyScale5};
          border-bottom: 0;
          transition-property: opacity;
          &.deleting {
            opacity: 0.6;
            pointer-events: none;
          }
          &:last-child {
            border-bottom: 1px solid ${theme.greyScale5};
          }
          & .itemContent {
            width: 100%;
            & .heading {
              justify-content: space-between;
              width: 100%;
              & .titleLink {
                font-size: 0.875em;
                color: #a42c90;
                font-weight: bold;
              }
              & .deleteButton {
                padding: 0 5px;
                & .trashIcon {
                  color: #a42c90;
                  &:hover {
                    cursor: pointer;
                    color: ${theme.hover};
                  }
                }
              }
            }
            & .queryStats {
              margin: 10px 0;
              color: ${theme.greyScale9};
              font-size: 0.75em;
              letter-spacing: 0.3px;
              color: ${theme.greyScale1};
            }
            & .savedDate {
              font-size: 0.75em;
            }
          }
        }
      }
    }
  `}`;
};
