// @flow

// Vendor
import React from 'react';
import PropTypes from 'prop-types';
import { compose, withState, shouldUpdate, mapProps } from 'recompose';
import CloseIcon from 'react-icons/lib/md/close';
import { withTheme } from 'emotion-theming';
import { PromptMessageContainer } from 'uikit/PromptMessage';
import styled from 'react-emotion';

/*----------------------------------------------------------------------------*/

const ToastContent = styled('div')`
  position: relative;
  pointer-events: all;
  width: 500px;
  max-width: 100%;
`;

const ToastContainer = styled(`div`)`
  position: fixed;
  top: 10px;
  width: 100vw;
  z-index: 100;
  pointer-events: none;
  text-align: center;
  word-break: break-word;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CloseButton = styled(CloseIcon)`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 15px;
  height: 15px;
  cursor: pointer;
  :hover: {
    color: red;
  }
`;

const ToastMessage = styled(PromptMessageContainer)`
  pointer-events: all;
  transition: transform 0.25s ease;
  transform: ${({ visible }) => (visible ? `translateY(0)` : `translateY(-140%)`)};
`;

const Toast = ({ style, theme, visible, action, close, closed, children, className }) => (
  <ToastContainer>
    <ToastMessage visible={visible} {...{ [action]: true }}>
      <CloseButton onClick={close} />
      <ToastContent>{children}</ToastContent>
    </ToastMessage>
  </ToastContainer>
);

Toast.propTypes = {
  style: PropTypes.object,
  children: PropTypes.node,
  id: PropTypes.string,
  visible: PropTypes.bool,
  action: PropTypes.string,
  close: PropTypes.func,
  delay: PropTypes.number,
};

let timeoutId;
let pageload = false;

const enhance = compose(
  withTheme,
  withState('visible', 'setState', false),
  shouldUpdate((props, nextProps) => {
    // Do not render on the first prop update, such as store rehydration
    if (pageload) {
      pageload = false;
      return false;
    }

    // Do not render if no children
    if (!nextProps.children) return false;

    // Do not render if the notification is not up and its children don't change.
    // This catches prop changes that should not affect the notification
    if (props.id === nextProps.id && (!props.visible && !nextProps.visible)) {
      return false;
    }

    function startTimer() {
      timeoutId = setTimeout(() => {
        props.setState(() => false);
      }, nextProps.delay || 5000);
    }

    // If the notification is not up, pop it up and begin the removal timeout
    if (!props.visible && !nextProps.visible) {
      props.setState(() => true);
      if (!nextProps.delay || nextProps.delay > 0) {
        startTimer();
      }
    }

    // If notification is up, refresh timeout when id changes
    if (props.visible && props.id !== nextProps.id) {
      clearTimeout(timeoutId);
      if (!nextProps.delay || nextProps.delay > 0) {
        startTimer();
      }
    }

    return true;
  }),
  mapProps(({ setState, ...rest }) => ({
    close: () => {
      setState(() => false);
      if (timeoutId) clearTimeout(timeoutId);
    },
    ...rest,
  })),
);

/*----------------------------------------------------------------------------*/

export default enhance(Toast);
