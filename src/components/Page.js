import React from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';

// const Page = ({ Component, backgroundImageUrl, containerStyle, ...props }) => (
//   <div
//     css={`
//       position: relative;
//       height: 100vh;
//       min-width: 1024px;
//       background-image: url(${backgroundImageUrl});
//       ${containerStyle};
//     `}
//   >
//     <div
//       className={css`
//         background-repeat: repeat;
//         height: 100%;
//         width: 100%;
//         display: flex;
//         flex-direction: column;
//         background-image: linear-gradient(to bottom, #fff 400px, transparent 100%);
//       `}
//     >
//       <Header />
//       <Component {...props} />
//       <Footer />
//     </div>
//   </div>
// );

const Page = ({
  Head = Header,
  Foot = Footer,
  Component,
  backgroundImageUrl,
  containerStyle,
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
      css={`
        background-repeat: repeat;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        background-image: linear-gradient(to bottom, #fff 400px, transparent 100%);
      `}
    >
      <Head />
      <Component {...props} />
      <Foot />
    </div>
  </div>
);

export default Page;
