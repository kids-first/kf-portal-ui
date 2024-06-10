import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { message as antMessage, notification as antNotification } from 'antd';
import cx from 'classnames';

import { globalActions, useGlobals } from 'store/global';

import styles from './index.module.css';

const NotificationContextHolder = () => {
  const dispatch = useDispatch();
  // notification is local only
  const { notification, message, messagesToDestroy } = useGlobals();

  useEffect(() => {
    if (notification) {
      antNotification.open({
        ...notification,
        description: React.createElement('div', {
          dangerouslySetInnerHTML: { __html: notification.description },
        }),
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
