import styled from 'react-emotion';
import Row from 'uikit/Column';

export const PromptMessageContainer = styled(Row)`
  align-items: left;
  background-color: ${({ theme, error, warning, info }) =>
    error
      ? theme.errorBackground
      : warning ? theme.warningBackground : info ? theme.infoBackground : theme.infoBackground};
  border-radius: 7px;
  border: solid 1px
    ${({ theme, error, warning, info }) =>
      error
        ? theme.errorBorder
        : warning ? theme.warningBorder : info ? theme.infoBorder : theme.infoBorder}};
  padding: 10px;
  margin-bottom: 1em;
`;

export const PromptMessageHeading = styled('div')`
  padding-right: 10px;
`;

export const PromptMessageContent = styled('div')`
  padding-top: 2px;
  line-height: 1.6em;
`;
