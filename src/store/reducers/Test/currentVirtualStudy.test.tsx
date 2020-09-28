import reducer from '../currentVirtualStudy';
import { Action } from 'redux';
import { requestCreateQueryInCohort } from '../../actionCreators/saveSets';
import { SetInfo } from '../../../components/UserDashboard/ParticipantSets';

const unknownAction: Action = { type: 'NO_EXISTS' };

const initialState = {
  sqons: [
    {
      op: 'and',
      content: [],
    },
  ],
  activeIndex: 0,
  uid: null,
  virtualStudyId: null,
  name: '',
  description: '',
  dirty: false,
  areSqonsEmpty: true,
  isLoading: false,
  error: null,
};

describe('Current Virtual Study Reducer', () => {
  it('should return the initial state when an unknown action is used', () => {
    expect(reducer(undefined, unknownAction)).toEqual(initialState);
  });

  it('should handle create set query request', () => {
    const setInfo: SetInfo = {
      key: 'id12345',
      name: 'thisSets',
      currentUser: 'SomeUser',
    };
    expect(reducer(initialState, requestCreateQueryInCohort(setInfo))).toEqual({
      sqons: [
        {
          op: 'and',
          content: [{ op: 'in', content: { field: 'kf_id', value: 'set_id:id12345' } }],
        },
      ],
      activeIndex: 0,
      uid: null,
      virtualStudyId: null,
      name: '',
      description: '',
      dirty: false,
      areSqonsEmpty: false,
      isLoading: false,
      error: null,
    });
  });
});
