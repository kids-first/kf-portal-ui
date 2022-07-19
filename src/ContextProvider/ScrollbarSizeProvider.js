import React from 'react';
import useScrollbarSize from 'react-scrollbar-size';

const { Consumer, Provider } = React.createContext(null);

const ScrollbarSizeProvider = ({ children }) => {
  const { height, width } = useScrollbarSize();

  return <Provider value={{ width, height }}>{children}</Provider>;
};

export const ScrollbarSize = Consumer;

export default ScrollbarSizeProvider;
