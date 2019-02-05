import React from 'react';
import Row from 'uikit/Row';
import styled from 'react-emotion';

const Bar = styled(Row)`
  width: 100%;
  padding: 0 29px;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
`;

const ContentBar = ({ children }) => <Bar>{children}</Bar>;

export default ContentBar;
