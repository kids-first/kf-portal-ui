import React from 'react';
import ExternalLink from 'uikit/ExternalLink';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';
import { Box } from 'uikit/Core';

export default compose(withTheme)(({ handle, theme, ...rest }) => {
  const commonStyle = {
    fontFamily: theme.fonts.default,
    fontWeight: 500,
  };
  return (
    <Box {...rest}>
      <span style={{ ...commonStyle, ...{ fontSize: '20px', color: '#404c9a' } }}>Tweets</span>
      <span style={{ style: { ...commonStyle, ...{ fontSize: '14px', color: theme.greyScale9 } } }}>
        {` by `}
      </span>
      <ExternalLink
        hasExternalIcon={false}
        href={`https://twitter.com/@${handle}`}
        style={{ ...commonStyle, ...{ fontSize: '14px', color: theme.primaryLight } }}
      >{`@${handle}`}</ExternalLink>
    </Box>
  );
});
