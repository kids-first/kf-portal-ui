import { get } from 'lodash';
import { css } from 'react-emotion';

export default ({ ROLES, profile }) =>
  `userProfile ${css`
    &.userProfile {
      flex: 1;

      & .container {
        justify-content: space-around;
        align-items: center;
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
        }
      }
    }
  `}`;
