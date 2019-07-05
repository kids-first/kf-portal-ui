import React from 'react';
import styled from 'react-emotion';
import Row from 'uikit/Row';
import Column from 'uikit/Column';
import { Flex } from 'uikit/Core';
import { withTheme } from 'emotion-theming';
import { applyDefaultStyles, Div } from './Core';

import ErrorSvg from 'icons/ErrorIcon';
import WarningSvg from 'icons/WarningIcon';
import NoteSvg from 'icons/NoteIcon';
import CircleCheckSvg from 'icons/CircleCheckIcon';

const ErrorIcon = withTheme(({ theme }) => (
  <ErrorSvg width={26} height={26} fill={theme.errorBorder} />
));

const InfoIcon = withTheme(({ theme }) => (
  <NoteSvg width={30} height={30} fill={theme.infoBorder} />
));

const SucessIcon = withTheme(({ theme }) => (
  <CircleCheckSvg width={30} height={30} fill={theme.successBorder} />
));

const WarningIcon = withTheme(({ theme }) => (
  <WarningSvg width={30} height={30} fill={theme.warningBorder} />
));

const MessageWrapper = applyDefaultStyles(styled(Column)`
  position: relative;
  align-items: left;
  background-color: ${({ theme, error, warning, success, info }) =>
    error
      ? theme.errorBackground
      : warning
      ? theme.warningBackground
      : success
      ? theme.successBackground
      : theme.infoBackground};
  border-left: solid 5px
    ${({ theme, error, warning, success, info }) =>
      error
        ? theme.errorBorder
        : warning
        ? theme.warningBorder
        : success
        ? theme.successBorder
        : theme.infoBorder}};
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
  theme,
  error,
  warning,
  success,
  info,
  className,
  children,
  ...rest
}) => (
  <MessageWrapper {...{ theme, error, warning, info, success, className, ...rest }}>
    <Row>
      <Flex flex={1} mr={10}>
        {error ? (
          <ErrorIcon />
        ) : warning ? (
          <WarningIcon />
        ) : success ? (
          <SucessIcon />
        ) : (
          <InfoIcon />
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
