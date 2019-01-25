import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import Column from 'uikit/Column';

const Container = styled(Column)`
  flex: 1;
  justify-content: center;
  align-items: center;
  border-right: 1px solid #d4d6dd;
  border-top: 4px solid ${({ color }) => (color ? color : 'inherit')};
`;

const Title = styled('h3')`
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.default}, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #404c9a;
`;

const Category = ({ title, color }) => (
  <Container color={color}>
    <Title> {title}</Title>
  </Container>
);

Category.propTypes = {
  title: PropTypes.string.isRequired,
  // /color: PropTypes.string.isRequired,
};

export default Category;
