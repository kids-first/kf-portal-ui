import React from 'react';
import Component from 'react-component-component';
import styled from 'react-emotion';

const Content = styled('div')`
  position: relative;
  display: flex;
  flex: 1;
`;

const ScrollContainer = styled('div')`
  flex: 1;
  overflow-y: ${props => (props.scrollable ? 'auto' : 'visible')};
`;

const Fader = styled('div')`
  background: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
  pointer-events: none;
  height: 50px;
  width: 100%;
  position: absolute;
  bottom: 0px;
  left: 0px;
  right: 0px;
  transition: all 0.5s;
  opacity: ${({ shown }) => (shown ? 1 : 0)};
`;

const isScrolledToBottom = domElement => {
  const { scrollTop, scrollHeight, offsetHeight } = domElement;
  return scrollTop + offsetHeight >= scrollHeight;
};

const CardContent = ({ children, scrollable = false, showsContentFader = true }) => {
  const initialState = { isAtBottom: !scrollable };
  const scrollContainerRef = React.createRef();
  const didMount = ({ setState }) => {
    scrollContainerRef.current.addEventListener('scroll', e => {
      setState({ isAtBottom: isScrolledToBottom(e.currentTarget) });
    });
  };
  return (
    <Component initialState={initialState} didMount={didMount}>
      {({ state }) => (
        <Content>
          <ScrollContainer innerRef={scrollContainerRef} scrollable={scrollable}>
            {children}
          </ScrollContainer>
          <Fader shown={scrollable && showsContentFader && !state.isAtBottom} />
        </Content>
      )}
    </Component>
  );
};

export default CardContent;
