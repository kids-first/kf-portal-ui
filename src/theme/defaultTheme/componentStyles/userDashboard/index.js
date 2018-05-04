import { css } from 'emotion';

export default `userDashboard ${css`
  height: calc(100% - 170px);

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

  & .mySavedQueries {
    display: flex;
    flex-direction: column;
    margin-top: 15px;
    flex: 3;
    border: 1px solid #e0e1e6;
    border-top: 0;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    padding: 0 10px;
    & .gradientBar {
      display: block;
      width: calc(100% + 22px);
      margin-left: -11px;
      height: 6px;
    }
    & .header {
      display: flex;
      flex-grow: 1;
      padding: 10px 20px 30px;
      display: flex;
      align-items: center;
      &.hascontent {
        border-bottom: 2px dotted #a9adc0;
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
          color: #a9adc0;
        }
      }
      & .saveIcon {
        width: 16px;
        color: #a9adc0;
      }
    }
  }
`}`;
