import { css } from 'react-emotion';

export default () =>
  `aboutMe ${css`
    &.aboutMe {
      display: flex;
      justify-content: center;
      padding: 50px 0;
      background-image: linear-gradient(to bottom, #fff 0%, #fff 70%, transparent 95%);

      & .container {
        align-items: flex-start;
        & .backgroundInfo {
          width: 65%;
          justify-content: space-around;
        }
        & .box {
          border-radius: 5px;
          box-shadow: 0 0 2.9px 0.1px #a0a0a3;
          padding: 1em;
          background-color: #ffffff;
        }
      }
    }
  `}`;
