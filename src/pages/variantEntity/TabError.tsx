import { Result } from 'antd';
import React from 'react';

const TabError = () => (
  <Result
    status="500"
    title="Server Error"
    subTitle="An error has occured and we are not able to load content at this time."
  />
);

export default TabError;
