import React from 'react';
import Row from 'uikit/Row';
import styled from 'react-emotion';

const Bar = styled(Row)`
  align-items: center;
  justify-content: space-between;
`;

const ContentBar = ({ children }) => <Bar>{children}</Bar>;

export default ContentBar;
