import React from 'react';

import { Box } from 'uikit/Core';
import FBIcon from 'icons/Facebook';

import { fbDisabledLogin, fbIconWrapper, fbButtonText } from './loginButtons.module.css';

export default () => (
  <Box className={`fb-login-button login-button ${fbDisabledLogin}`}>
    <Box className={fbIconWrapper}>
      <FBIcon />
    </Box>
    <Box className={fbButtonText}>Log in With Facebook</Box>
  </Box>
);
