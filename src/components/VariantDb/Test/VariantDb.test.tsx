import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import VariantDb from '../index';
import { jestPatchMatchMedia } from '../../../utils';
import Enzyme, { mount } from 'enzyme';

// configure({ adapter: new Adapter() });
Enzyme.configure({ adapter: new Adapter() });

describe('VariantDb', () => {
  const mockApi = jest.fn();
  // mockApi.mockReturnValueOnce(Promise.resolve({ status: 'STOPPED' }));

  beforeAll(() => jestPatchMatchMedia());

  let wrapper: Enzyme.ShallowWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>;

  it('should render Page', () => {
    mockApi.mockReturnValueOnce(
      new Promise((resolve) => {
        setTimeout(function () {
          resolve({ status: 'STOPPED' });
        }, 1000);
      }),
    );
    wrapper = mount(<VariantDb api={mockApi} />);
    expect(wrapper.length).toEqual(1);
  });

  it('should render delete button when required', () => {
    mockApi
      .mockResolvedValue({ status: 'STOPPED' })
      .mockResolvedValueOnce({ status: 'CREATE_IN_PROGRESS' })
      .mockResolvedValueOnce({ status: 'CREATE_COMPLETE' })
      .mockResolvedValueOnce({ status: 'DELETE_IN_PROGRESS' })
      .mockResolvedValueOnce({ status: 'ROLLBACK_COMPLETE' });

    wrapper = mount(<VariantDb api={mockApi} />);
    wrapper.setState({ status: 'CREATE_IN_PROGRESS' });
    expect(wrapper.find('#deleteClusterButton').length).toBeGreaterThan(0);

    wrapper = mount(<VariantDb api={mockApi} />);
    wrapper.setState({ status: 'CREATE_COMPLETE' });
    expect(wrapper.find('#deleteClusterButton').length).toBeGreaterThan(0);

    wrapper = mount(<VariantDb api={mockApi} />);
    wrapper.setState({ status: 'DELETE_IN_PROGRESS' });
    expect(wrapper.find('#deleteClusterButton').length).toBe(0);

    wrapper = mount(<VariantDb api={mockApi} />);
    wrapper.setState({ status: 'ROLLBACK_COMPLETE' });
    expect(wrapper.find('#deleteClusterButton').length).toBeGreaterThan(0);
  });
});
