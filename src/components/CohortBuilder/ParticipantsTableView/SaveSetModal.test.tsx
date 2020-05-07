import React from 'react';
import SaveSetModal, { validateNameSetInput, MAX_LENGTH_NAME } from './SaveSetModal';
import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { jestPatchMatchMedia } from '../../../utils';

configure({ adapter: new Adapter() });

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

  beforeEach(() => {
    wrapper = mount(<SaveSetModal {...props} />);
  });

  afterAll(() => {
    wrapper.unmount();
  });

  it('should render Save Set Modal', () => {
    expect(wrapper.length).toEqual(1);
  });
});

describe('validateNameSetInput', () => {
  it('should not allow special character %', () => {
    expect(validateNameSetInput('mySave%Set')).toHaveProperty('err', true);
  });

  it('should not allow empty input', () => {
    expect(validateNameSetInput('')).toHaveProperty('err', true);
  });

  it('should not contain blank or empty space(s)', () => {
    expect(validateNameSetInput('mySave Set')).toHaveProperty('err', true);
  });

  it(`should not allow more than ${MAX_LENGTH_NAME} characters`, () => {
    expect(validateNameSetInput('a'.repeat(MAX_LENGTH_NAME + 1))).toHaveProperty('err', true);
  });

  it(`should allow "-"`, () => {
    expect(validateNameSetInput('my-set')).toHaveProperty('err', false);
  });

  it(`should allow "_"`, () => {
    expect(validateNameSetInput('my_set')).toHaveProperty('err', false);
  });
});
