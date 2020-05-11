import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import VariantDb from '../index';
import { jestPatchMatchMedia } from '../../../utils';
import Enzyme, { mount } from 'enzyme';
import { clusterStatus } from '../store';

Enzyme.configure({ adapter: new Adapter() });

describe('VariantDb', () => {
  const mockApi = jest.fn();

  beforeAll(() => jestPatchMatchMedia());

  let wrapper: Enzyme.ShallowWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>;

  beforeEach(() => {
    wrapper = mount(<VariantDb api={mockApi} />);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should render Page', () => {
    mockApi.mockResolvedValueOnce({ status: clusterStatus.stopped });
    expect(wrapper.length).toEqual(1);
  });

  it('should render delete button when required', () => {
    mockApi
      .mockResolvedValue({ status: clusterStatus.stopped })
      .mockResolvedValueOnce({ status: clusterStatus.createInProgress })
      .mockResolvedValueOnce({ status: clusterStatus.createComplete })
      .mockResolvedValueOnce({ status: clusterStatus.deleteInProgress })
      .mockResolvedValueOnce({ status: clusterStatus.rollback });

    wrapper.setState({ status: clusterStatus.createInProgress });
    expect(wrapper.find('#deleteClusterButton').length).toBe(2); //Ant <Button/> wrapper and <button/> with same id

    wrapper.setState({ status: clusterStatus.createComplete });
    expect(wrapper.find('#deleteClusterButton').length).toBe(2);

    wrapper.setState({ status: clusterStatus.deleteInProgress });
    expect(wrapper.find('#deleteClusterButton').length).toBe(0);

    wrapper.setState({ status: clusterStatus.rollback });
    expect(wrapper.find('#deleteClusterButton').length).toBe(2);
  });
});
