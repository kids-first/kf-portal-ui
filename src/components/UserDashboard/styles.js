import Card from 'uikit/Card';
import {
  PromptMessageContainer as PMCont,
  PromptMessageHeading as PMHeading,
  PromptMessageContent as PMContent,
} from 'uikit/PromptMessage';
import Multicard from 'uikit/Multicard';
import { styleComponent } from 'components/Utils';
import {
  dashboardCard,
  promptMessageContainer,
  promptMessageContent,
  promptMessageHeading,
  cardLink,
  noteList,
} from './UserDashboard.module.css';

export const DashboardCard = styleComponent(Card, dashboardCard);
export const DashboardMulticard = styleComponent(Multicard, dashboardCard);
export const CardLink = styleComponent('a', cardLink);
export const NoteList = styleComponent('ul', noteList);
export const PromptMessageContainer = styleComponent(PMCont, promptMessageContainer);
export const PromptMessageContent = styleComponent(PMContent, promptMessageContent);
export const PromptMessageHeading = styleComponent(PMHeading, promptMessageHeading);
