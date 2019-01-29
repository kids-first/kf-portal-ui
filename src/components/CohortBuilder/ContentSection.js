import React from 'react';
import styled from 'react-emotion';
import Column from 'uikit/Column';

const Container = styled(Column)`
  width: 100%;
  background-color: #f4f5f8;
`;

const ContentSection = ({ children }) => <Container>{children} </Container>;

export default ContentSection;
