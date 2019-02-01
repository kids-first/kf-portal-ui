import React from 'react';
import Component from 'react-component-component';

const SQONProvider = ({ children }) => (
  <Component initialState={{ sqon: { content: 'content', op: 'not' } }}>
    {({ state }) => children(state)}
  </Component>
);

export default SQONProvider;
