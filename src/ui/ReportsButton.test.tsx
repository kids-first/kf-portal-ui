import React from 'react';
import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ReportsButton from './ReportsButton';
import { Sqon } from '../types';
import { Menu } from 'antd';

configure({ adapter: new Adapter() });

const mockSqon: Sqon = {
  op: 'and',
  content: [
    { op: 'in', content: { field: 'kf_id', value: ['PT_Q94JE8YB', 'PT_B8FHD6WF', 'PT_GS03DVBG'] } },
  ],
};
//FIXME : better testing (behaviour)
describe('ButtonReports (CohortBuilder)', () => {
  let wrapper: ReactWrapper;

  const generatorMenuItems = () => [
    <Menu.Item key="report1">{'report3'}</Menu.Item>,
    <Menu.Item key="report2">{'report2'}</Menu.Item>,
    <Menu.Item key="report3">{'Report1'}</Menu.Item>,
  ];

  const action = async (reportName: string, sqon: Sqon) => {
    const reportMap: { [index: string]: Function } = {
      report1: Promise.resolve,
      report2: Promise.resolve,
      report3: Promise.resolve,
    };

    const reportFn = reportMap[reportName];
    await reportFn(sqon);
  };

  beforeEach(() => {
    wrapper = mount(
      <ReportsButton sqon={mockSqon} generatorMenuItems={generatorMenuItems} action={action} />,
    );
  });

  afterAll(() => {
    wrapper.unmount();
  });

  it('should render', () => {
    expect(wrapper.length).toEqual(1);
  });
});
