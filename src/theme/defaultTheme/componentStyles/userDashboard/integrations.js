import { css } from 'emotion';

export default ({ theme }) => css`
  &.integrations {
    border-radius: 30px;
    background-color: #f4f5f8;
    border: solid 1px ${theme.greyScale5};
    padding: 10px 10px;
    align-items: center;
    justify-content: space-around;

    & .integrationsDiv {
      justify-content: space-around;
      align-items: center;
    }

    & .integrationsCircleDiv {
      width: 82px;
      height: 82px;
      flex: none;
      border-radius: 100%;
      background: #fff;
      display: flex;
      justify-content: center;
      border: solid 1px ${theme.greyScale5};
    }

    & .iconImage {
      width: 42px;
    }

    & .description {
      padding: 10px;
      max-width: 260px;
      & .externalLink {
        color: #a42c90;
      }
    }
  }
`;
