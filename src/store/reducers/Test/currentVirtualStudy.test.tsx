import { Action } from 'redux';

import { addSetToCurrentQuery, requestCreateQueryInCohort } from 'store/actionCreators/saveSets';
import { SetInfo } from 'store/saveSetTypes';

import reducer from '../currentVirtualStudy';

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
  selectionSqon: null,
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
    expect(reducer(initialState, requestCreateQueryInCohort(setInfo.key))).toEqual({
      sqons: [
        {
          op: 'and',
          content: [{ op: 'in', content: { field: 'kf_id', value: ['set_id:id12345'] } }],
        },
      ],
      activeIndex: 0,
      uid: null,
      virtualStudyId: null,
      name: '',
      description: '',
      dirty: false,
      selectionSqon: null,
      areSqonsEmpty: false,
      isLoading: false,
      error: null,
    });
  });

  it('should handle add set to current query correctly when query is empty', () => {
    const setId = '1234';
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
      selectionSqon: null,
      areSqonsEmpty: true,
      isLoading: false,
      error: null,
    };
    expect(reducer(initialState, addSetToCurrentQuery(setId))).toEqual({
      sqons: [
        {
          op: 'and',
          content: [{ op: 'in', content: { field: 'kf_id', value: ['set_id:1234'] } }],
        },
      ],
      activeIndex: 0,
      uid: null,
      virtualStudyId: null,
      name: '',
      description: '',
      dirty: false,
      selectionSqon: null,
      areSqonsEmpty: false,
      isLoading: false,
      error: null,
    });
  });

  it(
    'should handle add set to current query correctly when query is not empty' +
      ' and current sqon does not contain the set to add',
    () => {
      const setId = 'ed821267-8ff9-4f4d-a811-950f0ad8d5b6';
      const initialState = {
        sqons: [
          {
            op: 'and',
            content: [
              { op: 'in', content: { field: 'biospecimens.consent_type', value: ['DS-OBD-MDS'] } },
            ],
          },
          {
            op: 'and',
            content: [
              { op: 'in', content: { field: 'study.data_access_authority', value: ['PNOC DAC'] } },
              { op: 'in', content: { field: 'biospecimens.consent_type', value: ['__missing__'] } },
            ],
          },
        ],
        activeIndex: 1,
        uid: null,
        virtualStudyId: null,
        name: '',
        description: '',
        dirty: false,
        selectionSqon: null,
        areSqonsEmpty: true,
        isLoading: false,
        error: null,
      };
      expect(reducer(initialState, addSetToCurrentQuery(setId))).toEqual({
        sqons: [
          {
            op: 'and',
            content: [
              { op: 'in', content: { field: 'biospecimens.consent_type', value: ['DS-OBD-MDS'] } },
            ],
          },
          {
            op: 'and',
            content: [
              { op: 'in', content: { field: 'study.data_access_authority', value: ['PNOC DAC'] } },
              { op: 'in', content: { field: 'biospecimens.consent_type', value: ['__missing__'] } },
              {
                op: 'in',
                content: { field: 'kf_id', value: ['set_id:ed821267-8ff9-4f4d-a811-950f0ad8d5b6'] },
              },
            ],
          },
        ],
        activeIndex: 1,
        uid: null,
        virtualStudyId: null,
        name: '',
        description: '',
        dirty: false,
        selectionSqon: null,
        areSqonsEmpty: false,
        isLoading: false,
        error: null,
      });
    },
  );

  it('should handle add set to current query correctly when it already contains the set', () => {
    const setId = 'ed821267-8ff9-4f4d-a811-950f0ad8d5b6';
    const initialState = {
      sqons: [
        {
          op: 'and',
          content: [
            { op: 'in', content: { field: 'study.data_access_authority', value: ['PNOC DAC'] } },
            { op: 'in', content: { field: 'biospecimens.consent_type', value: ['__missing__'] } },
            {
              op: 'in',
              content: { field: 'kf_id', value: ['set_id:ed821267-8ff9-4f4d-a811-950f0ad8d5b6'] },
            },
          ],
        },
      ],
      activeIndex: 0,
      uid: null,
      virtualStudyId: null,
      name: '',
      description: '',
      dirty: false,
      selectionSqon: null,
      areSqonsEmpty: true,
      isLoading: false,
      error: null,
    };
    expect(reducer(initialState, addSetToCurrentQuery(setId))).toEqual({
      sqons: [
        {
          op: 'and',
          content: [
            { op: 'in', content: { field: 'study.data_access_authority', value: ['PNOC DAC'] } },
            { op: 'in', content: { field: 'biospecimens.consent_type', value: ['__missing__'] } },
            {
              op: 'in',
              content: { field: 'kf_id', value: ['set_id:ed821267-8ff9-4f4d-a811-950f0ad8d5b6'] },
            },
          ],
        },
      ],
      activeIndex: 0,
      uid: null,
      virtualStudyId: null,
      name: '',
      description: '',
      dirty: false,
      selectionSqon: null,
      areSqonsEmpty: false,
      isLoading: false,
      error: null,
    });
  });

  it('should handle add set to current query correctly when it contains another set', () => {
    const setId = 'ed821267-8ff9-4f4d-a811-950f0ad8d5b6';
    const initialState = {
      sqons: [
        {
          op: 'and',
          content: [
            { op: 'in', content: { field: 'study.data_access_authority', value: ['PNOC DAC'] } },
            {
              op: 'in',
              content: { field: 'kf_id', value: ['set_id:123'] },
            },
            { op: 'in', content: { field: 'biospecimens.consent_type', value: ['__missing__'] } },
          ],
        },
      ],
      activeIndex: 0,
      uid: null,
      virtualStudyId: null,
      name: '',
      description: '',
      dirty: false,
      selectionSqon: null,
      areSqonsEmpty: true,
      isLoading: false,
      error: null,
    };
    expect(reducer(initialState, addSetToCurrentQuery(setId))).toEqual({
      sqons: [
        {
          op: 'and',
          content: [
            { op: 'in', content: { field: 'study.data_access_authority', value: ['PNOC DAC'] } },
            {
              op: 'in',
              content: {
                field: 'kf_id',
                value: ['set_id:123', 'set_id:ed821267-8ff9-4f4d-a811-950f0ad8d5b6'],
              },
            },
            { op: 'in', content: { field: 'biospecimens.consent_type', value: ['__missing__'] } },
          ],
        },
      ],
      activeIndex: 0,
      uid: null,
      virtualStudyId: null,
      name: '',
      description: '',
      dirty: false,
      selectionSqon: null,
      areSqonsEmpty: false,
      isLoading: false,
      error: null,
    });
  });
});
