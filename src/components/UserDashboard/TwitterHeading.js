import React from 'react';
import styled, { css } from 'react-emotion';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';
import { Box, applyDefaultStyles } from 'uikit/Core';
import ExternalLink from 'uikit/ExternalLink';

export default compose(withTheme)(({ handle, theme, ...rest }) => {
  const baseStyle = css`
    font-family: ${theme.fonts.default};
    font-weight: 500;
  `;
  const BaseElement = applyDefaultStyles(styled('span')`
    ${baseStyle};
  `);
  const Link = styled(ExternalLink)`
    ${baseStyle};
  `;
  return (
    <Box {...rest}>
      <BaseElement fontSize="20px" color={theme.secondary}>
        Tweets
      </BaseElement>
      <BaseElement fontSize="14px" color={theme.greyScale9}>{` by `}</BaseElement>
      <Link hasExternalIcon={false} href={`https://twitter.com/@${handle}`}>{`@${handle}`}</Link>
    </Box>
  );
});
