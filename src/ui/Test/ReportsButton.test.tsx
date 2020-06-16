import React from 'react';
import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ReportsButton from '../ReportsButton';
import { Sqon } from '../../store/sqon';
import { Button as AntdButton, Menu } from 'antd';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { ReportState } from '../../store/reportTypes';

configure({ adapter: new Adapter() });

const middleware = [thunk];
const mockStore = configureStore(middleware);

const mockSqon: Sqon = {
  op: 'and',
  content: [
    { op: 'in', content: { field: 'kf_id', value: ['PT_Q94JE8YB', 'PT_B8FHD6WF', 'PT_GS03DVBG'] } },
  ],
};

const initialReportState: ReportState = {
  isLoading: false,
  error: null,
  message: null,
};

describe('Report Button', () => {
  let wrapper: ReactWrapper;

  const generatorMenuItems = () => [
    <Menu.Item key="report1">{'report3'}</Menu.Item>,
    <Menu.Item key="report2">{'report2'}</Menu.Item>,
    <Menu.Item key="report3">{'Report1'}</Menu.Item>,
  ];

  const mountWithProvider = (fakeStore: any) =>
    mount(
      <Provider store={fakeStore}>
        <ReportsButton sqon={mockSqon} generatorMenuItems={generatorMenuItems} />
      </Provider>,
    );

  afterAll(() => {
    wrapper.unmount();
  });

  it('should render', () => {
    const store = mockStore({
      report: {
        ...initialReportState,
      },
    });
    wrapper = mountWithProvider(store);
    expect(wrapper.exists()).toBe(true);
  });

  it('should display an "antd" Button with a loader when required', () => {
    const store = mockStore({
      report: {
        ...initialReportState,
        isLoading: true,
      },
    });
    wrapper = mountWithProvider(store);
    const Button = wrapper.find(AntdButton);
    expect(Button.props().loading).toBe(true);
  });

  it('should display a disabled "antd" Button with no loader when there is an error', () => {
    const store = mockStore({
      report: {
        ...initialReportState,
        error: true,
      },
    });
    wrapper = mountWithProvider(store);
    const Button = wrapper.find(AntdButton);
    expect(Button.props().loading).toBe(false);
    expect(Button.props().disabled).toBe(true);
  });
});
