import React from 'react';

import { egoApiRoot } from 'common/injectGlobals';
import { Box } from 'uikit/Core';

const SecurityError = () => (
  <Box style={{ maxWidth: '600px' }}>
    Connection to ego failed, you may need to visit
    <a target="_blank" rel="noopener noreferrer" href={egoApiRoot}>
      {egoApiRoot}
    </a>
    in a new tab and accept the warning
  </Box>
);

export default SecurityError;
