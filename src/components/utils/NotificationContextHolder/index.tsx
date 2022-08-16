import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { globalActions, useGlobals } from 'store/global';
import { notification as antNotification } from 'antd';
import { message as antMessage } from 'antd';
import cx from 'classnames';

import styles from './index.module.scss';

const NotificationContextHolder = () => {
  const dispatch = useDispatch();
  const { notification, message, messagesToDestroy } = useGlobals();

  useEffect(() => {
    if (notification) {
      antNotification.open({
        ...notification,
        style: undefined,
        onClose: () => {
          if (notification.onClose) {
            notification.onClose();
          }
          dispatch(globalActions.destroyNotification());
        },
      });
    }
    // eslint-disable-next-line
  }, [notification]);

  useEffect(() => {
    if (message) {
      antMessage.open({
        ...message,
        style: undefined,
        className: cx(styles.antMessage, styles[message.type]),
        onClose: () => {
          if (message.onClose) {
            message.onClose();
          }
          dispatch(globalActions.destroyMessages([]));
        },
      });
    }
    // eslint-disable-next-line
  }, [message]);

  useEffect(() => {
    if (messagesToDestroy) {
      messagesToDestroy.forEach((messageId) => {
        antMessage.destroy(messageId);
      });
    }
    // eslint-disable-next-line
  }, [messagesToDestroy]);

  return null;
};

export default NotificationContextHolder;
