import React from 'react';
import SaveSetModal, { extractTagNumbers, validateNameSetInput } from '../SaveSetModal';
import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { jestPatchMatchMedia } from 'utils';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { SaveSetState, UserSet } from 'store/saveSetTypes';
import { getSetAndParticipantsCountByUser } from 'services/sets';

configure({ adapter: new Adapter() });

const middleware = [thunk];
const mockStore = configureStore(middleware);
const userSaveSets = [] as UserSet[];

const initialSaveSetModalState: SaveSetState = {
  create: {
    isLoading: false,
    error: null,
  },
  userSets: {
    sets: userSaveSets,
    error: null,
    isLoading: true,
    isEditing: false,
    isDeleting: false,
  },
};

jest.mock('services/sets');

describe('Save Set Modal', () => {
  const props = {
    sqon: {
      op: 'and',
      content: [
        {
          op: 'in',
          content: {
            field: 'observed_phenotype.name',
            value: ['Abnormality of the skeletal system (HP:0000924)'],
          },
        },
      ],
    },
    hideModalCb: jest.fn(),
    api: jest.fn(),
    user: {
      _id: 'abc',
      roles: ['researcher'],
      egoId: '123',
      email: 'abc@gmail.com',
      acceptedDatasetSubscriptionKfOptIn: true,
      acceptedKfOptIn: true,
      acceptedNihOptIn: true,
      acceptedTerms: true,
    },
  };

  beforeAll(() => jestPatchMatchMedia());

  let wrapper: ReactWrapper;

  const mountWithProvider = (fakeStore: any) =>
    mount(
      <Provider store={fakeStore}>
        <SaveSetModal {...props} />
      </Provider>,
    );

  beforeAll(() => jestPatchMatchMedia());

  afterAll(() => {
    wrapper.unmount();
  });

  beforeEach(() => {
    (getSetAndParticipantsCountByUser as jest.Mock).mockReset();
  });

  it('should render Save Set Modal', () => {
    (getSetAndParticipantsCountByUser as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve([]),
    );
    const store = mockStore({
      saveSets: initialSaveSetModalState,
    });
    wrapper = mountWithProvider(store);
    expect(wrapper.exists()).toBe(true);
  });

  it('should disable Save button on tag name conflict', () => {
    const store = mockStore({
      saveSets: {
        ...initialSaveSetModalState,
        create: {
          error: Error('Some Error'),
        },
      },
    });
    wrapper = mountWithProvider(store);
    expect(wrapper.find('#CreateSaveSets').at(0).props()['disabled']).toBe(true);
  });
});

describe('validateNameSetInput', () => {
  it('should not allow empty input', () => {
    expect(validateNameSetInput('')).toHaveProperty('err', true);
  });
  it('should not allow blank input', () => {
    expect(validateNameSetInput(' ')).toHaveProperty('err', true);
  });
  it('should allow blank or empty space(s)', () => {
    expect(validateNameSetInput('mySave Set')).toHaveProperty('err', false);
  });
  it(`should allow "-"`, () => {
    expect(validateNameSetInput('my-set')).toHaveProperty('err', false);
  });
  it(`should allow "_"`, () => {
    expect(validateNameSetInput('my_set')).toHaveProperty('err', false);
  });
  it('should return 1st default saved set tag name if none already exists', async () => {
    const input = [
      {
        node: {
          setId: '1',
          size: 1,
          tag: 'SAVED_SET_1',
        },
      },
      {
        node: {
          setId: '2',
          size: 1,
          tag: 'saved_set_3',
        },
      },
      {
        node: {
          setId: '3',
          size: 1,
          tag: 'toto-name_4',
        },
      },
      {
        node: {
          setId: '4',
          size: 1,
          tag: 'tutu-name_1',
        },
      },
    ];
    expect(extractTagNumbers(input as [{ node: UserSet }])).toEqual([1, 3]);
  });
});
