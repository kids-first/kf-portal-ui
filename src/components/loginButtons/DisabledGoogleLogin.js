import React from 'react';

import { Box } from 'uikit/Core';
import GIcon from 'assets/google-icon.png';

import {
  googleDisabledLogin,
  googleIcon,
  googleIconWrapper,
  googleButtonText,
} from './loginButtons.module.css';

export default () => (
  <Box className={googleDisabledLogin}>
    <Box className={googleIconWrapper}>
      <img className={googleIcon} src={GIcon} alt="Google Login" />
    </Box>
    <Box className={googleButtonText}>Sign in with Google</Box>
  </Box>
);
