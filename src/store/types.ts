import { GlobalInitialState } from 'store/global';
import { UserInitialState } from 'store/user';
import { PersonaInitialState } from 'store/persona';
import { FenceConnectionInitialState } from 'store/fenceConnection';
import { SavedFilterInitialState } from './savedFilter';
import { SavedSetInitialState } from './savedSet';
import { ReportInitialState } from './report';
import { FenceCavaticaInitialState } from './fenceCavatica';
import { fenceStudiesInitialState } from './fenceStudies';
import { NotebookInitialState } from './notebook';
import { RemoteInitialState } from './remote';

export type RootState = {
  global: GlobalInitialState;
  user: UserInitialState;
  persona: PersonaInitialState;
  notebook: NotebookInitialState;
  report: ReportInitialState;
  fenceConnection: FenceConnectionInitialState;
  fenceStudies: fenceStudiesInitialState;
  savedFilter: SavedFilterInitialState;
  savedSet: SavedSetInitialState;
  fenceCavatica: FenceCavaticaInitialState;
  remote: RemoteInitialState;
};
