import React from 'react';
import { withTheme } from 'emotion-theming';
import Header from 'components/Header';
import Footer from 'components/Footer';

const Page = withTheme(
  ({
    Head = Header,
    Foot = Footer,
    Component,
    backgroundImageUrl,
    containerStyle,
    theme,
    ...props
  }) => (
    <div
      css={`
        position: relative;
        height: 100vh;
        min-width: 1024px;
        background-image: url(${backgroundImageUrl});
        ${containerStyle};
      `}
    >
      <div
        className={theme.column}
        css={`
          background-repeat: repeat;
          height: 100%;
          width: 100%;
          background-image: linear-gradient(to bottom, #fff 400px, transparent 100%);
        `}
      >
        <Head />
        <Component {...props} />
        <Foot />
      </div>
    </div>
  ),
);

export default Page;
