import React from 'react';
import { injectState } from 'freactal';
import { compose } from 'recompose';

import { PromptMessageContainer, PromptMessageContent } from 'uikit/PromptMessage';

const enhance = compose(injectState);

export const ModalWarning = enhance(({ children }) => (
  <PromptMessageContainer error>
    <PromptMessageContent>{children}</PromptMessageContent>
  </PromptMessageContainer>
));
