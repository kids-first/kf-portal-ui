import { Action } from 'redux';

import {
  addFenceStudies,
  addStudiesConnectionStatus,
  removeAllFencesStudies,
  removeFenceStudies,
  toggleIsFetchingAllFenceStudies,
  toggleIsFetchingOneFenceStudies,
} from 'store/actionCreators/fenceStudies';
import { MOCK_GEN3_STUDY_PHS_001436 } from 'store/actionCreators/Test/mockDataFence';

import { logout } from '../../actionCreators/user';
import { ConnectionStatus } from '../../connectionTypes';
import { FenceStudiesState } from '../../fenceStudiesTypes';
import { AllFencesNames, FenceName } from '../../fenceTypes';
import { LogoutAction } from '../../userTypes';
import reducer from '../fenceStudies';

const GEN3 = FenceName.gen3;

const unknownAction: Action = { type: 'NO_EXISTS' };

const initialState: FenceStudiesState = {
  fenceStudies: {},
  loadingStudiesForFences: [],
  statuses: {
    [FenceName.gen3]: ConnectionStatus.unknown,
    [FenceName.dcf]: ConnectionStatus.unknown,
  },
};

describe('Fence Studies Reducer', () => {
  it('should return the initial state when an unknown action is used', () => {
    // @ts-ignore compilation does not allow such action, but must be tested for vanilla javascript
    expect(reducer(undefined, unknownAction)).toEqual(initialState);
  });

  it('should handle toggleIsFetchingAllFenceStudies', () => {
    expect(reducer(initialState, toggleIsFetchingAllFenceStudies(true))).toEqual({
      ...initialState,
      loadingStudiesForFences: [...AllFencesNames],
    });
  });

  it('should handle toggleIsFetchingOneFenceStudies', () => {
    expect(reducer(initialState, toggleIsFetchingOneFenceStudies(true, FenceName.gen3))).toEqual({
      ...initialState,
      loadingStudiesForFences: [FenceName.gen3],
    });
  });

  it('should handle removeFenceStudies', () => {
    const state: FenceStudiesState = {
      ...initialState,
      fenceStudies: {
        [FenceName.gen3]: {
          authorizedStudies: [MOCK_GEN3_STUDY_PHS_001436],
        },
      },
    };
    expect(reducer(state, removeFenceStudies(FenceName.gen3))).toEqual({
      ...state,
      fenceStudies: {},
    });
  });

  it('should handle addFenceStudies', () => {
    expect(
      reducer(
        initialState,
        addFenceStudies({
          [FenceName.gen3]: {
            authorizedStudies: [MOCK_GEN3_STUDY_PHS_001436],
          },
        }),
      ),
    ).toEqual({
      ...initialState,
      fenceStudies: {
        [FenceName.gen3]: {
          authorizedStudies: [MOCK_GEN3_STUDY_PHS_001436],
        },
      },
    });
  });

  it('should handle removeAllFencesStudies', () => {
    const state: FenceStudiesState = {
      ...initialState,
      fenceStudies: {
        [GEN3]: {
          authorizedStudies: [MOCK_GEN3_STUDY_PHS_001436],
        },
      },
    };
    expect(reducer(state, removeAllFencesStudies())).toEqual({
      ...initialState,
    });
  });

  it('should handle addStudiesConnectionStatus', () => {
    expect(
      reducer(initialState, addStudiesConnectionStatus(FenceName.gen3, ConnectionStatus.connected)),
    ).toEqual({
      ...initialState,
      statuses: {
        [FenceName.gen3]: ConnectionStatus.connected,
        [FenceName.dcf]: ConnectionStatus.unknown,
      },
    });
  });

  it('should handle logout', () => {
    const state: FenceStudiesState = {
      ...initialState,
      fenceStudies: {
        [FenceName.gen3]: {
          authorizedStudies: [MOCK_GEN3_STUDY_PHS_001436],
        },
      },
    };
    expect(reducer(state, logout() as LogoutAction)).toEqual({
      ...initialState,
    });
  });
});
