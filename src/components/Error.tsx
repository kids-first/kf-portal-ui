import React from 'react';

import SplashPage from 'components/SplashPage';

type OwnProps = {
  text?: string;
};

const Error = ({ text = 'An error has occurred, please try again later' }: OwnProps) => (
  <SplashPage
    title={'Error'}
    mainTitle={'Kids First Data Resource Portal'}
    content={<div style={{ textAlign: 'center' }}>{text}</div>}
  />
);

export default Error;
