import React from 'react';

import styled from 'react-emotion';

import { Box } from 'uikit/Core';

import GIcon from 'assets/google-icon.png';

const DisabledLogin = styled(Box)`
  background-color: #efefef;
  color: #cfcece;
  opacity: 0.75;
  margin-bottom: 16px;
  border-radius: 1px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
  transition: background-color 0.218s, border-color 0.218s, box-shadow 0.218s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
    cursor: not-allowed;
  }
`;

const GoogleIcon = styled('img')`
  height: 26px;
`;

const IconWrapper = styled(Box)`
  background-color: #fff;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: auto;
  padding: 10px;
`;

const ButtonText = styled(Box)`
  margin: 0 auto 0 6px;
  letter-spacing: 0.21px;
  font-weight: 500;
  font-size: 14px;
  line-height: 38px;
`;

const DisabledGoogleLogin = () => (
  <DisabledLogin height="40px" width="240px" className="google-login-button login-button">
    <IconWrapper>
      <GoogleIcon src={GIcon} />
    </IconWrapper>
    <ButtonText>Sign in with Google</ButtonText>
  </DisabledLogin>
);

export default DisabledGoogleLogin;
