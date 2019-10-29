import React from 'react';

import styled from 'react-emotion';

import { Box } from 'uikit/Core';

import FBIcon from 'icons/Facebook';

const DisabledLogin = styled(Box)`
  background-color: #efefef;
  color: #cfcece;
  opacity: 0.75;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;

  &:hover {
    cursor: not-allowed;
  }
`;

const IconWrapper = styled(Box)`
  margin-right: auto;
  height: 100%;

  svg {
    margin: 8px;
  }
`;

const ButtonText = styled(Box)`
  margin: 0 24px 0 12px;
  font-family: Helvetica, Arial, sans-serif;
  letter-spacing: 0.25px;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
`;

const DisabledGoogleLogin = () => (
  <DisabledLogin height="40px" width="240px" className="fb-login-button login-button">
    <IconWrapper>
      <FBIcon />
    </IconWrapper>
    <ButtonText>Log in With Facebook</ButtonText>
  </DisabledLogin>
);

export default DisabledGoogleLogin;
