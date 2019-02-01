import React from 'react';
import Component from 'react-component-component';

const SQONProvider = ({ children }) => (
  <Component initialState={{ sqons: [], activeIndex: 0 }}>{props => children(props)}</Component>
);

export default SQONProvider;
