import { css } from 'emotion';

export { default as mySavedQueries } from './mySavedQueries';

export default ({ profileColors }) =>
  `${css`
    &.userDashboard {
      height: calc(100% - 170px);
    }

    & .dashboardContent {
      padding: 40px;
    }

    & .profileInfoBar {
      width: 411px;
      height: 100%;
      box-shadow: 0 0 4.8px 0.2px #a0a0a3;
      padding-top: 40px;
      align-content: space-around;
      align-items: center;
      color: #fff;
      font-family: Montserrat;
      font-size: 14px;
      flex: none;
      text-align: center;
      background-image: linear-gradient(
        to bottom,
        ${profileColors.gradientDark} 33%,
        ${profileColors.gradientMid} 66%,
        ${profileColors.gradientLight}
      );

      & .gravatar {
        background-color: #fff;
        border: 1px solid #cacbcf;
        width: 100%;
        height: 100%;
      }

      & .roleIconButton {
        margin-top: 20px;
        margin-bottom: 43px;
        width: 290px;
      }

      & .userFullName {
        text-decoration: underline;
        text-align: center;
        color: #ffffff;
        font-size: 28px;
        font-weight: 500;
        line-height: 1.11;
        letter-spacing: 0.4px;
        margin-bottom: 24px;
      }
      & .jobTitle {
        font-size: 18px;
      }
      & .email {
        margin: 40px 0 58px;
        text-decoration: underline;
      }
    }
  `}`;
