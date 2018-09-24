import React from 'react';

import styled from 'react-emotion';

import { Box } from 'uikit/Core';

import FBIcon from 'icons/Facebook';

const DisabledLogin = styled(Box)`
  opacity: 0.45;
  background-color: #4267b2;
  color: #fff;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;

  &:hover {
    cursor: not-allowed;
  }
`;

const IconWrapper = styled(Box)``;

const ButtonText = styled(Box)`
  font-family: Helvetica, Arial, sans-serif;
  letter-spacing: 0.25px;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
`;

const DisabledGoogleLogin = () => (
  <DisabledLogin height="40px" width="240px">
    <IconWrapper>
      <FBIcon />
    </IconWrapper>
    <ButtonText>Log in With Facebook</ButtonText>
  </DisabledLogin>
);

export default DisabledGoogleLogin;
