import { GlobalInitialState } from 'store/global';
import { UserInitialState } from 'store/user';

import { CommunityInitialState } from './community';
import { FencesInitialState } from './fences';
import { NotebookInitialState } from './notebook';
import { PassportInitialState } from './passport';
import { RemoteInitialState } from './remote';
import { ReportInitialState } from './report';
import { SavedFilterInitialState } from './savedFilter';
import { SavedSetInitialState } from './savedSet';
import { VennInitialState } from './venn';

export type RootState = {
  global: GlobalInitialState;
  user: UserInitialState;
  notebook: NotebookInitialState;
  report: ReportInitialState;
  fences: FencesInitialState;
  savedFilter: SavedFilterInitialState;
  savedSet: SavedSetInitialState;
  remote: RemoteInitialState;
  passport: PassportInitialState;
  community: CommunityInitialState;
  venn: VennInitialState;
};
