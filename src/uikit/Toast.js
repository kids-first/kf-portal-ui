// @flow

// Vendor
import React from 'react';
import PropTypes from 'prop-types';
import { compose, withState, shouldUpdate, mapProps } from 'recompose';
import CloseIcon from 'react-icons/lib/md/close';

/*----------------------------------------------------------------------------*/

const styles = {
  wrapper: {
    position: 'fixed',
    top: 0,
    width: '100vw',
    zIndex: 100,
    pointerEvents: 'none',
    textAlign: 'center',
    wordBreak: 'break-word',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    margin: '1rem 0',
    transition: 'transform 0.25s ease',
  },
  inactive: {
    transform: 'translateY(-140%)',
  },
  active: {
    transform: 'translateY(0)',
  },
  info: {
    color: '#5C5151',
    backgroundColor: '#EDF8FB',
    border: '1px solid #B4CCD4',
  },
  success: {
    color: '#3c763d',
    backgroundColor: '#dff0d8',
    border: '1px solid #d6e9c6',
  },
  error: {
    color: '#773c63',
    backgroundColor: '#f0d8dd',
    border: '1px solid #e9c6c6',
  },
  warning: {
    color: '#8a6d3b',
    backgroundColor: '#fcf8e3',
    border: '1px solid #faebcc',
  },
  toast: {
    position: 'relative',
    padding: '1.5rem',
    width: '40rem',
    borderRadius: '10px',
    pointerEvents: 'all',
    boxShadow: '0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12)',
  },
  closeIcon: {
    position: 'absolute',
    top: '5px',
    right: '5px',
    cursor: 'pointer',
    ':hover': {
      color: 'red',
    },
  },
};

const Toast = ({ style, visible, action, close, closed, children, className }) => (
  <div style={styles.wrapper} className={className}>
    <div
      style={{
        ...styles.container,
        ...(visible && !closed ? styles.active : styles.inactive),
        ...style,
      }}
      className="test-notification"
    >
      <div style={{ ...styles.toast, ...(styles[action] || styles.success) }}>
        <CloseIcon style={styles.closeIcon} onClick={close} />
        {children}
      </div>
    </div>
  </div>
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
