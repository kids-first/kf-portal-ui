import React from 'react';
import styled from 'react-emotion';
import Row from 'uikit/Row';
import Column from 'uikit/Column';
import { Flex } from 'uikit/Core';
import { applyDefaultStyles, Div } from './Core';

import ErrorSvg from 'icons/ErrorIcon';
import WarningSvg from 'icons/WarningIcon';
import NoteSvg from 'icons/NoteIcon';
import CircleCheckSvg from 'icons/CircleCheckIcon';

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

const MessageWrapper = applyDefaultStyles(styled(Column)`
  position: relative;
  align-items: left;
  background-color: ${({ error, warning, success, info }) =>
    error
      ? COLORS.ERROR.background
      : warning
      ? COLORS.WARNING.background
      : success
      ? COLORS.SUCCESS.background
      : COLORS.INFO.background};
  border-left: solid 5px
    ${({ error, warning, success, info }) =>
      error
        ? COLORS.ERROR.border
        : warning
        ? COLORS.WARNING.border
        : success
        ? COLORS.SUCCESS.border
        : COLORS.INFO.border};
  padding: 10px;
  margin-bottom: 1em;
  border-bottom-right-radius: 5px;
  border-top-right-radius: 5px;
  padding: 20px;
`);

export const PromptMessageHeading = applyDefaultStyles(styled(Div)`
  padding-right: 10px;
  font-size: 20px;
`);

export const PromptMessageContent = applyDefaultStyles(styled(Div)`
  padding-top: 2px;
  line-height: 1.6em;
  font-family: 'Open Sans', sans-serif;
  font-size: 15px;
  line-height: 30px;
`);

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
      <Flex flex={1} mr={10}>
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

export default ({ heading, content, className = '', ...props }) => (
  <PromptMessageContainer className={className} {...props}>
    <PromptMessageHeading {...props}>{heading}</PromptMessageHeading>
    <PromptMessageContent {...props}>{content}</PromptMessageContent>
  </PromptMessageContainer>
);
