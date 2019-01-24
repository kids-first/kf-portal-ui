import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import Column from 'uikit/Column';

const Container = styled(Column)`
  width: 100%;
  background-color: #f4f5f8;
  padding: 40px;
`;

const ContentSection = ({ children }) => <Container>{children} </Container>;

export default ContentSection;
