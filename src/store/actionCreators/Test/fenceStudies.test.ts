import { AnyAction } from 'redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { getAuthStudiesIdAndCount, getStudiesCountByNameAndAcl } from 'services/fenceStudies';
import { DispatchFenceStudies, FenceStudiesActions } from 'store/fenceStudiesTypes';

import { FenceName } from '../../fenceTypes';
import {
  addFenceStudies,
  computeAllFencesAuthStudies,
  fetchFenceStudies,
  fetchFenceStudiesIfNeeded,
  removeFenceStudies,
  toggleIsFetchingAllFenceStudies,
} from '../fenceStudies';

import {
  MOCK_AUTH_STUDIES_FROM_GEN3,
  MOCK_AUTH_STUDIES_WITH_2_FENCES,
  MOCK_STUDIES_IDS_AND_COUNTS,
  mockApi,
} from './mockDataFence';

const DCF = FenceName.dcf;
const GEN3 = FenceName.gen3;

const NO_ACTIONS: AnyAction[] = [];

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

jest.mock('services/fenceStudies');

describe('Fence Studies actions', () => {
  beforeEach(() => {
    (getAuthStudiesIdAndCount as jest.Mock).mockReset();
    (getStudiesCountByNameAndAcl as jest.Mock).mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an action to toggle all fence studies', () => {
    const expectedAction = {
      type: FenceStudiesActions.toggleIsFetchingAllFenceStudies,
      isLoading: true,
    };
    expect(toggleIsFetchingAllFenceStudies(true)).toEqual(expectedAction);
  });

  it('should create an action when removing a fence studies', () => {
    const expectedAction = {
      type: FenceStudiesActions.removeFenceStudies,
      fenceName: DCF,
    };
    expect(removeFenceStudies(DCF)).toEqual(expectedAction);
  });

  it('should transform auth studies adequately', () => {
    expect(computeAllFencesAuthStudies(MOCK_AUTH_STUDIES_WITH_2_FENCES)).toEqual([
      {
        acl: ['*'],
        authorizedFiles: 5239,
        id: `${GEN3}_1`,
        studyShortName: `studyShortName_${GEN3}_1`,
        totalFiles: 19791,
      },
      {
        acl: ['*'],
        authorizedFiles: 5239,
        id: `${DCF}_1`,
        studyShortName: `studyShortName_${DCF}_1`,
        totalFiles: 19791,
      },
    ]);
  });

  it('should create an action to add a fence studies', () => {
    const expectedAction = {
      type: FenceStudiesActions.addFenceStudies,
      fenceAuthorizedStudies: MOCK_AUTH_STUDIES_WITH_2_FENCES,
    };
    expect(addFenceStudies(MOCK_AUTH_STUDIES_WITH_2_FENCES)).toEqual(expectedAction);
  });

  it('should fetch fence studies when user is adequately connected to a data repository', async () => {
    (getAuthStudiesIdAndCount as jest.Mock).mockImplementation(() =>
      Promise.resolve(MOCK_STUDIES_IDS_AND_COUNTS),
    );
    (getStudiesCountByNameAndAcl as jest.Mock).mockImplementation(() =>
      Promise.resolve(MOCK_AUTH_STUDIES_FROM_GEN3),
    );
    const store = mockStore({
      fenceStudies: {
        fenceStudies: {},
        isFetchingAllFenceStudies: false,
      },
    });

    const dispatch: DispatchFenceStudies = store.dispatch;

    await dispatch(fetchFenceStudies(mockApi, GEN3, []));

    const expectedActions = [
      {
        type: FenceStudiesActions.addFenceStudies,
        fenceAuthorizedStudies: { [GEN3]: { authorizedStudies: MOCK_AUTH_STUDIES_FROM_GEN3 } },
      },
    ];
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should  fetch fence studies if user has already has connection for particular fence', async () => {
    (getAuthStudiesIdAndCount as jest.Mock).mockImplementation(() =>
      Promise.resolve(MOCK_STUDIES_IDS_AND_COUNTS),
    );
    (getStudiesCountByNameAndAcl as jest.Mock).mockImplementation(() =>
      Promise.resolve(MOCK_AUTH_STUDIES_FROM_GEN3),
    );

    const store = mockStore({
      fenceStudies: {
        fenceStudies: MOCK_AUTH_STUDIES_WITH_2_FENCES,
        isFetchingAllFenceStudies: false,
      },
    });

    const dispatch: DispatchFenceStudies = store.dispatch;

    await dispatch(fetchFenceStudiesIfNeeded(mockApi, GEN3, { [GEN3]: ['phs'] }));

    expect(store.getActions()).toEqual(NO_ACTIONS);
  });
});
