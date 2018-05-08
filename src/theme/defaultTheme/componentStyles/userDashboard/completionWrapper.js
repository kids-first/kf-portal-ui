import { css } from 'emotion';

export default ({ innerCircleSize }) =>
  `completionWrapper ${css`
    &.completionWrapper {
      box-sizing: border-box;
      width: 208px;
      padding: 0.73%;
      border-radius: 50%;
      position: relative;
      overflow: hidden;
      & .backdrop {
        background-color: #fff;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        opacity: 0.5;
      }
      & .innerCircle {
        border-radius: 50%;
        overflow: hidden;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: ${innerCircleSize};
        height: ${innerCircleSize};
      }
      svg {
        display: block;
      }
    }
  `}`;
