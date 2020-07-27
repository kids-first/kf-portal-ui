import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  EntityName,
  ERROR_MSG_ID_NOT_FOUND,
  FAILURE,
  RE_INITIALIZE_STATE,
  TOGGLE_LOADING,
} from '../../fileSearchFiltersTypes';
import {
  failureFilter,
  reInitializeFilterState,
  searchById,
  searchByKfId,
  toggleFilterLoading,
} from '../fileSearchFilters';
import { searchFilesFromKfId, transformIdIntoKfId } from 'services/fileSearchFilters';

const entityName = EntityName.PARTICIPANT;

describe('File search filters actions', () => {
  it('should create an action when error', () => {
    const error = new Error('a network error');

    const expectedAction = {
      type: FAILURE,
      error,
      entityName,
    };
    expect(failureFilter(error, entityName)).toEqual(expectedAction);
  });

  it('should create an action to toggle loader', () => {
    const isLoading = true;

    const expectedAction = {
      type: TOGGLE_LOADING,
      isLoading,
      entityName,
    };
    expect(toggleFilterLoading(isLoading, entityName)).toEqual(expectedAction);
  });

  it('should create an action to re initialize state', () => {
    const expectedAction = {
      type: RE_INITIALIZE_STATE,
      entityName,
    };
    expect(reInitializeFilterState(entityName)).toEqual(expectedAction);
  });
});

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

jest.mock('services/fileSearchFilters');

describe('searchByKfId', () => {
  beforeEach(() => {
    (searchFilesFromKfId as jest.Mock).mockReset();
  });

  it('should generate the correct flow when searching a file for a kf_id', async () => {
    (searchFilesFromKfId as jest.Mock).mockImplementation(() => {});
    const expectedActions = [
      { type: TOGGLE_LOADING, isLoading: true, entityName },
      { type: TOGGLE_LOADING, isLoading: false, entityName },
    ];
    const store = mockStore({
      fileSearchFilters: {
        [EntityName.PARTICIPANT]: {
          isLoading: false,
          error: null,
        },
      },
    });

    // @ts-ignore
    await store.dispatch(searchByKfId({ setArrangerSqonCB: () => {}, id: 'PT_1', entityName }));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should generate an error when unsuccessfully when searching a file for a kf_id', async () => {
    (searchFilesFromKfId as jest.Mock).mockImplementation(() => {
      throw new Error('error');
    });
    const expectedActions = [
      { type: TOGGLE_LOADING, isLoading: true, entityName },
      { type: FAILURE, error: new Error('error'), entityName },
      { type: TOGGLE_LOADING, isLoading: false, entityName },
    ];
    const store = mockStore({
      fileSearchFilters: {
        [EntityName.PARTICIPANT]: {
          isLoading: false,
          error: null,
        },
      },
    });

    // @ts-ignore
    await store.dispatch(searchByKfId({ setArrangerSqonCB: () => {}, id: 'PT_1', entityName }));
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe('searchById', () => {
  beforeEach(() => {
    (searchFilesFromKfId as jest.Mock).mockReset();
    (transformIdIntoKfId as jest.Mock).mockReset();
  });

  it('should generate the correct flow when searching a file for a given id', async () => {
    (searchFilesFromKfId as jest.Mock).mockImplementation(() => {});
    (transformIdIntoKfId as jest.Mock).mockImplementation(() => Promise.resolve('kfId'));
    const expectedActions = [
      { type: TOGGLE_LOADING, isLoading: true, entityName },
      { type: TOGGLE_LOADING, isLoading: false, entityName },
      { type: TOGGLE_LOADING, isLoading: true, entityName },
      { type: TOGGLE_LOADING, isLoading: false, entityName },
    ];
    const store = mockStore({
      fileSearchFilters: {
        [EntityName.PARTICIPANT]: {
          isLoading: false,
          error: null,
        },
      },
    });

    // @ts-ignore
    await store.dispatch(searchById({ setArrangerSqonCB: () => {}, id: 'ID_1', entityName }));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should fail when the input id can not be transformed into a kf_id', async () => {
    (searchFilesFromKfId as jest.Mock).mockImplementation(() => {});
    (transformIdIntoKfId as jest.Mock).mockImplementation(() => Promise.resolve(null));
    const expectedActions = [
      { type: TOGGLE_LOADING, isLoading: true, entityName },
      { type: TOGGLE_LOADING, isLoading: false, entityName },
      {
        type: FAILURE,
        error: new Error(ERROR_MSG_ID_NOT_FOUND),
        entityName,
      },
    ];
    const store = mockStore({
      fileSearchFilters: {
        [EntityName.PARTICIPANT]: {
          isLoading: false,
          error: null,
        },
      },
    });

    // @ts-ignore
    await store.dispatch(searchById({ setArrangerSqonCB: () => {}, id: 'ID_1', entityName }));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should fail when the input id transformation fails', async () => {
    (searchFilesFromKfId as jest.Mock).mockImplementation(() => {});
    (transformIdIntoKfId as jest.Mock).mockImplementation(() => Promise.reject('error'));
    const expectedActions = [
      { type: TOGGLE_LOADING, isLoading: true, entityName },
      {
        type: FAILURE,
        error: 'error',
        entityName,
      },
      { type: TOGGLE_LOADING, isLoading: false, entityName },
    ];
    const store = mockStore({
      fileSearchFilters: {
        [EntityName.PARTICIPANT]: {
          isLoading: false,
          error: null,
        },
      },
    });

    // @ts-ignore
    await store.dispatch(searchById({ setArrangerSqonCB: () => {}, id: 'ID_1', entityName }));
    expect(store.getActions()).toEqual(expectedActions);
  });
});
