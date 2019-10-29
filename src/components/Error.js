import React from 'react';
import SplashPage from 'components/SplashPage';
import PropTypes from 'prop-types';

const Error = ({ text = 'An error has occurred, please try again later' }) => (
  <SplashPage>
    <div
      css={`
        text-align: center;
      `}
    >
      {text}
    </div>
  </SplashPage>
);

Error.propTypes = {
  text: PropTypes.string,
};

export default Error;
