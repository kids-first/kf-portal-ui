import {
  PromptMessageContainer as PMCont,
  PromptMessageHeading as PMHeading,
  PromptMessageContent as PMContent,
} from 'uikit/PromptMessage';

import { styleComponent } from 'components/Utils';

import {
  promptMessageContainer,
  promptMessageContent,
  promptMessageHeading,
} from './Charts.module.css';

export const PromptMessageContainer = styleComponent(PMCont, promptMessageContainer);
export const PromptMessageContent = styleComponent(PMContent, promptMessageContent);
export const PromptMessageHeading = styleComponent(PMHeading, promptMessageHeading);
