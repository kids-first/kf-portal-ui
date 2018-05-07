import { css } from 'emotion';
import { modalFooter } from '../modal';

export const shareQuery = () =>
  `shareQuery ${css`
    &.shareQuery {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px;
      background-color: aliceblue;
      border: 1px solid #d6d6d6;
    }
  `}`;

export const shareQueryTooltipContent = () =>
  `tooltipContent ${css`
    &.tooltipContent {
      width: 200px;
    }
    & .itemRow {
      padding: 10px;
      display: flex;
      align-items: center;
      cursor: pointer;
      &.errorMsg {
        justify-content: center;
      }
      &:hover {
        background-color: rgb(240, 240, 240);
      }

      & .bubble {
        background-color: purple;
        color: white;
        padding: 4px 6px;
        border-radius: 100%;
        margin-right: 10px;
      }
    }
  `}`;

export const saveQuery = () =>
  `saveQuery ${css`
    &.saveQuery {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px;
      background-color: aliceblue;
      border: 1px solid #d6d6d6;
    }
  `}`;

export const saveQueryTooltipContent = theme =>
  `saveQueryTooltipContent
  ${modalFooter}
  ${css`
    &.saveQueryTooltipContent {
      position: relative;
      height: 225px;

      & .heading {
        border-bottom: 1px solid ${theme.greyScale4};
        padding: 7px;
        display: flex;
        align-items: center;
      }

      & .explanation {
        padding: 0 9px;
        font-style: italic;
        color: ${theme.greyScale2};
      }

      & .queryNamePrompt {
        font-weight: bold;
        margin-top: 10px;
        padding: 0 9px;
        color: ${theme.greyScale2};
      }

      & .queryNameInput {
        border-radius: 10px;
        background-color: #ffffff;
        border: solid 1px #cacbcf;
        padding: 5px;
        font-size: 1em;
        margin: 10px;
        margin-bottom: 0px;
        width: calc(100% - 30px);
      }

      & .successSlideIn {
        transform: translateX(-100%);
        transition: transform 0.3s ease;
        color: red;
        position: absolute;
        color: red;
        width: 100%;
        height: 100%;
        background-color: #00afee;
        z-index: 1;
        text-align: center;
        &.shown {
          transform: translateX(0%);
        }
        & .slideInContent {
          color: white;
          font-size: 20px;
          padding: 20px;
          font-weight: bold;
        }
        & .niceWhiteButton {
          margin: 0 auto;
          padding: 10px 15px;
        }
      }
    }
  `}`;
