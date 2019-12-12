import React from 'react';
import Row from 'uikit/Row';
import Column from 'uikit/Column';
import { Div, Flex } from 'uikit/Core';
import omit from 'lodash/omit';

import ErrorSvg from 'icons/ErrorIcon';
import WarningSvg from 'icons/WarningIcon';
import NoteSvg from 'icons/NoteIcon';
import CircleCheckSvg from 'icons/CircleCheckIcon';

import styles from './PromptMessage.module.css';

const COLORS = {
  SUCCESS: {
    dark: '#009bb8', //green
    light: '#e6f3f5',
    background: '#e6f3f5',
    border: `#009bb8`,
  },
  ERROR: {
    dark: '#d8202f', //red
    light: '#fadfe1', //light red (pink) fill
    background: '#f9dee1',
    border: `#e45562`,
  },
  INFO: {
    dark: '#22afe9', //blue
    light: '#e8f7fd',
    background: '#e8f7fd',
    border: `#22afe9`,
  },
  WARNING: {
    dark: '#ff9427', //yellow
    light: '#ff9427',
    background: '#fff4e9',
    border: `#ff9427`,
  },
};

const MessageWrapper = ({
  children,
  className = '',
  error = false,
  warning = false,
  success = false,
  info = false,
  ...props
}) => {
  const severity = error ? 'error' : warning ? 'warning' : success ? 'success' : 'info';
  return (
    <Column className={`${styles.messageWrapper} ${severity} ${className}`} {...props}>
      {children}
    </Column>
  );
};

export const PromptMessageHeading = ({ children, className = '', ...props }) => (
  <Div className={`${styles.promptMessageHeading} ${className}`} {...props}>
    {children}
  </Div>
);

export const PromptMessageContent = ({ children, className = '', ...props }) => (
  <Div className={`${styles.promptMessageContent} ${className}`} {...props}>
    {children}
  </Div>
);

export const PromptMessageContainer = ({
  error,
  warning,
  success,
  info,
  className,
  children,
  ...rest
}) => (
  <MessageWrapper {...{ error, warning, info, success, className, ...rest }}>
    <Row>
      <Flex mr={10}>
        {error ? (
          <ErrorSvg width={26} height={26} fill={COLORS.ERROR.border} />
        ) : warning ? (
          <WarningSvg width={30} height={30} fill={COLORS.WARNING.border} />
        ) : success ? (
          <CircleCheckSvg width={30} height={30} fill={COLORS.SUCCESS.border} />
        ) : (
          <NoteSvg width={30} height={30} fill={COLORS.INFO.border} />
        )}
      </Flex>
      <Column textAlign={'left'}>{children}</Column>
    </Row>
  </MessageWrapper>
);

const filterOutProps = props => omit(props, ['error', 'warning', 'info', 'success']);
export default ({ heading, content, className = '', ...props }) => (
  <PromptMessageContainer className={className} {...props}>
    <PromptMessageHeading {...filterOutProps(props)}>{heading}</PromptMessageHeading>
    <PromptMessageContent {...filterOutProps(props)}>{content}</PromptMessageContent>
  </PromptMessageContainer>
);
