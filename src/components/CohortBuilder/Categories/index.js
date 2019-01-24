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
    <Category title="Quick Filters" color={''} />
    <Category title="Study" color={''} />
    <Category title="Demographic" color={''} />
    <Category title="Clinical" color={''} />
    <Category title="Biospecimens" color={''} />
    <Category title="Available Data" color={''} />
    <Category title="Upload IDs" color={''} />
  </Container>
);

export default Categories;
