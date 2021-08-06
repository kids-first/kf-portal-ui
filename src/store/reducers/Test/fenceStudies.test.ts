import { Action } from 'redux';

import {
  addFenceStudies,
  removeAllFencesStudies,
  removeFenceStudies,
  toggleIsFetchingAllFenceStudies,
} from 'store/actionCreators/fenceStudies';
import { MOCK_GEN3_STUDY_PHS_001436 } from 'store/actionCreators/Test/mockDataFence';

import { logout } from '../../actionCreators/user';
import { FenceStudiesState } from '../../fenceStudiesTypes';
import { FenceName } from '../../fenceTypes';
import { LogoutAction } from '../../userTypes';
import reducer from '../fenceStudies';

const GEN3 = FenceName.gen3;

const unknownAction: Action = { type: 'NO_EXISTS' };

const initialState: FenceStudiesState = {
  fenceStudies: {},
  isFetchingAllFenceStudies: false,
};

describe('Fence Studies Reducer', () => {
  it('should return the initial state when an unknown action is used', () => {
    // @ts-ignore compilation does not allow such action, but must be tested for vanilla javascript
    expect(reducer(undefined, unknownAction)).toEqual(initialState);
  });

  it('should handle toggleIsFetchingAllFenceStudies', () => {
    expect(reducer(initialState, toggleIsFetchingAllFenceStudies(true))).toEqual({
      fenceStudies: {},
      isFetchingAllFenceStudies: true,
    });
  });

  it('should handle removeFenceStudies', () => {
    const state: FenceStudiesState = {
      fenceStudies: {
        [GEN3]: {
          authorizedStudies: [MOCK_GEN3_STUDY_PHS_001436],
        },
      },
      isFetchingAllFenceStudies: false,
    };
    expect(reducer(state, removeFenceStudies(GEN3))).toEqual({
      fenceStudies: {},
      isFetchingAllFenceStudies: false,
    });
  });

  it('should handle addFenceStudies', () => {
    const state: FenceStudiesState = {
      fenceStudies: {},
      isFetchingAllFenceStudies: false,
    };
    expect(
      reducer(
        state,
        addFenceStudies({
          [GEN3]: {
            authorizedStudies: [MOCK_GEN3_STUDY_PHS_001436],
          },
        }),
      ),
    ).toEqual({
      fenceStudies: {
        [GEN3]: {
          authorizedStudies: [MOCK_GEN3_STUDY_PHS_001436],
        },
      },
      isFetchingAllFenceStudies: false,
    });
  });

  it('should handle removeAllFencesStudies', () => {
    const state: FenceStudiesState = {
      fenceStudies: {
        [GEN3]: {
          authorizedStudies: [MOCK_GEN3_STUDY_PHS_001436],
        },
      },
      isFetchingAllFenceStudies: false,
    };
    expect(reducer(state, removeAllFencesStudies())).toEqual({
      fenceStudies: {},
      isFetchingAllFenceStudies: false,
    });
  });

  it('should handle logout', () => {
    const state: FenceStudiesState = {
      fenceStudies: {
        [GEN3]: {
          authorizedStudies: [MOCK_GEN3_STUDY_PHS_001436],
        },
      },
      isFetchingAllFenceStudies: false,
    };
    expect(reducer(state, logout() as LogoutAction)).toEqual({
      fenceStudies: {},
      isFetchingAllFenceStudies: false,
    });
  });
});
