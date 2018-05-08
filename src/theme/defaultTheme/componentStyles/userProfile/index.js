import { get } from 'lodash';
import { css } from 'react-emotion';

export { default as aboutMe } from './aboutMe';

export default ({ ROLES, profile }) =>
  `userProfile ${css`
    &.userProfile {
      flex: 1;

      & .container {
        justify-content: space-around;
        height: 100%;
        width: 76%;
      }

      & .hero {
        background: url(${get(
            ROLES.reduce((acc, { type, banner }) => ({ ...acc, [type]: banner }), {}),
            get(profile.roles, 0),
            '',
          )})
          no-repeat;
        background-color: #1094d5;
        min-height: 330px;
        align-items: center;
        display: flex;
        justify-content: center;

        & .container {
          align-items: center;
        }

        & .gravatar {
          border-radius: 50%;
          border: 5px solid #fff;
        }

        & .profileInfo {
          width: 49%;
          align-items: flex-start;
          padding: 0 15px;
          & .content {
            font-family: montserrat;
            font-size: 14px;
            color: #fff;
            & .email {
              text-decoration: underline;
            }
            & .hollowButton {
              margin-top: 5px;
            }
          }
        }
        & .progressContainer {
          width: 310px;
          align-items: center;
          & .completionWrapper {
            width: 130px;
          }
          & .completionGuide {
            font-family: 'Open Sans';
            font-size: 13px;
            font-style: italic;
            line-height: 1.69;
            color: #ffffff;
            padding-top: 21px;
          }
        }
      }

      & .secondaryNav {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        background: #fff;
        box-shadow: 0 0 4.9px 0.1px #bbbbbb;
        border: solid 1px #e0e1e6;
        padding: 15px 0;
      }
    }
  `}`;
