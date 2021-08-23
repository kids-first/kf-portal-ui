import React from 'react';

import { PromptMessageContainer, PromptMessageContent } from 'uikit/PromptMessage';

export const ModalWarning = ({ children }) => (
  <PromptMessageContainer error>
    <PromptMessageContent>{children}</PromptMessageContent>
  </PromptMessageContainer>
);
