import React from 'react';
import Row from 'uikit/Row';
import styled from 'react-emotion';

const Bar = styled(Row)`
  width: 100%;
  padding: 30px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
`;

const ContentBar = ({ children }) => <Bar>{children}</Bar>;

export default ContentBar;
