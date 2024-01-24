import { GlobalInitialState } from 'store/global';
import { PersonaInitialState } from 'store/persona';
import { UserInitialState } from 'store/user';

import { FencesInitialState } from './fences';
import { NotebookInitialState } from './notebook';
import { PassportInitialState } from './passport';
import { RemoteInitialState } from './remote';
import { ReportInitialState } from './report';
import { SavedFilterInitialState } from './savedFilter';
import { SavedSetInitialState } from './savedSet';

export type RootState = {
  global: GlobalInitialState;
  user: UserInitialState;
  persona: PersonaInitialState;
  notebook: NotebookInitialState;
  report: ReportInitialState;
  fences: FencesInitialState;
  savedFilter: SavedFilterInitialState;
  savedSet: SavedSetInitialState;
  remote: RemoteInitialState;
  passport: PassportInitialState;
};
