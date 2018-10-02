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

  const words = [
    {
      text: 'Tweets',
      el: 'span',
      props: {
        style: { ...commonStyle, ...{ fontSize: '20px', color: '#404c9a' } },
      },
    },
    {
      text: 'by',
      el: 'span',
      props: { style: { ...commonStyle, ...{ fontSize: '14px', color: theme.greyScale9 } } },
    },
    {
      text: `@${handle}`,
      el: ExternalLink,
      props: {
        style: { ...commonStyle, ...{ fontSize: '14px', color: theme.primaryLight } },
        hasExternalIcon: false,
        href: `https://twitter.com/@${handle}`,
      },
    },
  ];

  const output = words.map((w, i) => {
    const text = i !== words.length - 1 ? w.text + ' ' : w.text;
    return React.createElement(w.el, w.props, text);
  });

  return <Box {...rest}>{output}</Box>;
});
