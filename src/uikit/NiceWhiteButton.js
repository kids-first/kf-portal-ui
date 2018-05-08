import React from 'react';
import styled from 'react-emotion';

const NiceWhiteButton = props => {
  const Button = styled.button`
    border-radius: 19px;
    background-color: #ffffff;
    border: solid 1px #cacbcf;
    font-size: 11px;
    letter-spacing: 0.2px;
    color: ${props => props.theme.tertiary};
    padding: 5px 18px 5px 5px;

    align-items: center;
    justify-content: center;
    text-transform: uppercase;
    font-weight: bold;
    cursor: pointer;

    :disabled {
      cursor: default;
      color: ${props => props.theme.greyScale2}
      background-color: ${props => props.theme.greyScale5}
    }
  `;
  return <Button {...props} className={`niceWhiteButton ${props.className}`} />;
};

export default NiceWhiteButton;
