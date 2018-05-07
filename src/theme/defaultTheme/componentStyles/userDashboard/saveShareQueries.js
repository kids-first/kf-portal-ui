import { css } from 'emotion';

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
