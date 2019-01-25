import React from 'react';
import styled from 'react-emotion';
import Column from 'uikit/Column';

const Container = styled(Column)`
  width: 250px;
  justify-content: center;
  align-items: center;
  border-top: 2px solid blue;
  border-right: 1px solid #d4d6dd;
`;

const Search = () => <Container> Search</Container>;

export default Search;
