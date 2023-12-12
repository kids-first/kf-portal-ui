import { FenceConnectionInitialState } from 'store/fenceConnection';
import { GlobalInitialState } from 'store/global';
import { PersonaInitialState } from 'store/persona';
import { UserInitialState } from 'store/user';

import { FenceCavaticaInitialState } from './fenceCavatica';
import { fencesInitialState } from './fences';
import { fenceStudiesInitialState } from './fenceStudies';
import { NotebookInitialState } from './notebook';
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
  fenceConnection: FenceConnectionInitialState;
  fenceStudies: fenceStudiesInitialState;
  fences: fencesInitialState;
  savedFilter: SavedFilterInitialState;
  savedSet: SavedSetInitialState;
  fenceCavatica: FenceCavaticaInitialState;
  remote: RemoteInitialState;
};
