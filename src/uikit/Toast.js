import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { compose, withState, shouldUpdate, mapProps } from 'recompose';
import CloseIcon from 'react-icons/lib/md/close';
import { PromptMessageContainer } from 'uikit/PromptMessage';

import './Toast.css';

const Toast = ({ visible = false, action = null, close = noop, children = null }) => {
  const childProps = action !== null ? { [action]: true } : {};
  return (
    <div className="toastContainer">
      <PromptMessageContainer
        className={`toastMessage ${visible ? 'visible' : ''}`}
        {...childProps}
      >
        <CloseIcon className="closeButton" onClick={close} />
        <div className="toastContent">{children}</div>
      </PromptMessageContainer>
    </div>
  );
};

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
    if (props.id === nextProps.id && !props.visible && !nextProps.visible) {
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

export default enhance(Toast);
