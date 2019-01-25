import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import Column from 'uikit/Column';
import Search from './Search';
import Category from './Category';
import Row from 'uikit/Row';

const Container = styled(Row)`
  height: 72px;
  width: 100%;
  border-left: 1px solid #d4d6dd;
  border-bottom: 1px solid #d4d6dd;
  background-color: white;
`;

const Categories = () => (
  <Container>
    <Search />
    <Category title="Quick Filters" color="#404c9a" />
    <Category title="Study" color="#dd1f2a" />
    <Category title="Demographic" color="#e53a95" />
    <Category title="Clinical" color="#00aceb" />
    <Category title="Biospecimens" color="#f79122" />
    <Category title="Available Data" color="#009bba" />
    <Category title="Upload IDs" color="#edb500" />
  </Container>
);

export default Categories;
