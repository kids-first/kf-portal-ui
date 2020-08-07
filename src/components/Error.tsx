/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react';
import SplashPage from 'components/SplashPage';

type OwnProps = {
  text?: string;
};

const Error: FunctionComponent<OwnProps> = ({
  text = 'An error has occurred, please try again later',
}) => (
  <SplashPage
    title={'Error'}
    mainTitle={'Kids First Data Resource Portal'}
    content={<div style={{ textAlign: 'center' }}>{text}</div>}
  />
);

export default Error;
