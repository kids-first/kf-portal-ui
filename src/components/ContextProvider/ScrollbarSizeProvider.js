import React, { Fragment } from 'react';
import Component from 'react-component-component';
import DetectScrollbarSize from 'react-scrollbar-size';

const { Consumer, Provider } = React.createContext(null);

const ScrollbarSizeProvider = ({ children }) => (
  <Component initialState={{ scrollbarWidth: 0, scrollbarHeight: 0 }}>
    {({ state, setState }) => (
      <Fragment>
        <DetectScrollbarSize {...{ onLoad: setState, onChange: setState }} />
        <Provider value={state}>{children}</Provider>
      </Fragment>
    )}
  </Component>
);

export const ScrollbarSize = Consumer;

export default ScrollbarSizeProvider;
