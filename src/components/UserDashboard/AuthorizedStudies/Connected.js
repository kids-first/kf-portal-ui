import React from 'react';
import {
  PromptMessageContainer,
  PromptMessageHeading,
  PromptMessageContent,
} from 'uikit/PromptMessage';
const Connected = () => (
  <PromptMessageContainer info mb={'8px'}>
    <PromptMessageHeading info mb={10}>
      You are connected to Gen3, but you don’t have access to controlled data yet.
    </PromptMessageHeading>
    <PromptMessageContent>
      Start applying for access to studies of interest from our
    </PromptMessageContent>
  </PromptMessageContainer>
);

export default Connected;
