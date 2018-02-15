import { css } from 'react-emotion';

const colors = {
  primary: '#90278e', //magenta
  secondary: '#2b388f', //purplish blue
  primaryHover: '#404c9a', //purple
  tertiary: '#009bb8', //teal-blue

  active: '#00afed', //light blue
  inactive: '#dedfe4', //grey

  greyScale7: 'rgb(107,98,98)',
  greyScale6: 'rgb(245,245,245)',
  greyScale5: 'rgb(222,222,222)',
  greyScale4: 'rgb(200, 200, 200)',
  greyScale3: 'rgb(144,144,144)', // not enough contrast on white background
  greyScale2: 'rgb(61,61,61)',
  greyScale1: 'rgb(36,36,36)',
};

const components = {
  button: css`
    outline: none;
    border: 0;
    background: none;
    box-shadow: none;
    border-radius: 0px;
    background-color: ${colors.primary};
    color: white;
    padding: 6px 16px;
    font-family: montserrat;
    font-size: 14px;
    line-height: 1.86;
    letter-spacing: 0.2px;
    margin: 0px 4px;
    border-radius: 19px;
    border: solid 2px transparent;

    &:hover {
      background-color: ${colors.primaryHover};
      border: solid 2px #dcdde3;
      color: #ffffff;
    }

    &:link {
      color: #ffffff;
    }
  `,
  wizardButton: css`
    outline: none;
    border: 0;
    background: none;
    box-shadow: none;
    border-radius: 0px;
    background-color: '#fff';
    color: ${colors.tertiary};
    padding: 6px 16px;
    font-family: montserrat;
    font-size: 14px;
    font-weight: 800;
    line-height: 1.86;
    letter-spacing: 0.2px;
    margin: 0px 4px;
    border-radius: 19px;
    border: solid 2px transparent;

    &:hover {
      background-color: ${colors.tertiary};
      color: #ffffff;
    }
    &:link {
      text-decoration: none;
    }
    &:disabled {
      color: grey;
    }
    &:disabled:hover {
      color: grey;
      background-color: transparent;
    }
  `,
  card: css`
    border-radius: 10px;
    background-color: #ffffff;
    box-shadow: 0 0 4.9px 0.1px ${colors.greyScale5};
    border: solid 1px ${colors.greyScale4};
    padding: 20px 10px;
  `,
  h2: css`
    text-align: center;
    font-family: 'Open Sans';
    color: ${colors.secondary};
  `,
  h3: css`
    font-family: 'Open Sans';
    color: ${colors.secondary};
  `,
  input: css`
    width: 374px;
    min-width: 0;
    padding: 6px 12px;
    font-size: 14px;
    line-height: 1.42857143;
    background-color: #fff;
    border: 1px solid ${colors.greyScale4};
    border-radius: 10px;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
    transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;

    &:disabled {
        background-color: ${colors.greyScale3};
        color: ${colors.greyScale4};
    }
  },
  `,
  column: css`
    display: flex;
    flex-direction: column;
  `,
  row: css`
    display: flex;
    flex-direction: row;
  `,
};

export default {
  ...colors,
  ...components,
};
