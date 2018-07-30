import React from 'react';
import styled from 'react-emotion';
import Row from 'uikit/Row';
import Column from 'uikit/Column';
import { Flex } from 'uikit/Core';
import { withTheme } from 'emotion-theming';
import { applyDefaultStyles, Div } from './Core';

import ErrorSvg from 'icons/ErrorIcon';
import InfoSvg from 'icons/InfoIcon';
import CircleCheckSvg from 'icons/CircleCheckIcon';

const ErrorIcon = withTheme(({ theme }) => (
  <ErrorSvg width={30} height={30} fill={theme.errorBorder} />
));

const InfoIcon = withTheme(({ theme }) => (
  <CircleCheckSvg width={30} height={30} fill={theme.infoBorder} />
));

const SucessIcon = withTheme(({ theme }) => (
  <CircleCheckSvg width={30} height={30} fill={theme.successBorder} />
));

const WarningIcon = withTheme(({ theme }) => (
  <InfoSvg width={30} height={30} fill={theme.warningBorder} />
));

const MessageWrapper = applyDefaultStyles(styled(Column)`
  position: relative;
  align-items: left;
  background-color: ${({ theme, error, warning, success, info }) =>
    error
      ? theme.errorBackground
      : warning
        ? theme.warningBackground
        : info ? theme.infoBackground : success ? theme.successBackground : theme.infoBackground};
  border-left: solid 5px
    ${({ theme, error, warning, success, info }) =>
      error
        ? theme.errorBorder
        : warning
          ? theme.warningBorder
          : info ? theme.infoBorder : success ? theme.successBorder : theme.infoBorder}};
  padding: 10px;
  margin-bottom: 1em;
  border-bottom-right-radius: 5px;
  border-top-right-radius: 5px;
  padding: 20px;
`);

const PrompMessageWrapper = ({ theme, error, warning, success, info, className, children }) => (
  <MessageWrapper {...{ theme, error, warning, info, success, className }}>
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

export const PromptMessageContainer = PrompMessageWrapper;

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

export default ({ heading, content, ...props }) => (
  <PromptMessageContainer {...props}>
    <PromptMessageHeading {...props}>{heading}</PromptMessageHeading>
    <PromptMessageContent {...props}>{content}</PromptMessageContent>
  </PromptMessageContainer>
);
