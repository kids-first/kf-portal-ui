import { styleComponent } from 'components/Utils';
import {
  PromptMessageContainer as PMCont,
  PromptMessageContent as PMContent,
  PromptMessageHeading as PMHeading,
} from 'uikit/PromptMessage';

import {
  cardLink,
  noteList,
  promptMessageContainer,
  promptMessageContent,
  promptMessageHeading,
} from './UserDashboard.module.css';

export const CardLink = styleComponent('a', cardLink);
export const NoteList = styleComponent('ul', noteList);
export const PromptMessageContainer = styleComponent(PMCont, promptMessageContainer);
export const PromptMessageContent = styleComponent(PMContent, promptMessageContent);
export const PromptMessageHeading = styleComponent(PMHeading, promptMessageHeading);
