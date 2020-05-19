import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { jestPatchMatchMedia } from '../../../utils';
import EntityContentSection from '../EntityContentSection';

Enzyme.configure({ adapter: new Adapter() });

describe('In EntityContentSection', () => {
  const children = <div />;
  const TABS = [
    {
      tabName: 'tab_1',
      accessor: 'tab_1_accessor',
    },
    {
      tabName: 'tab_2',
      accessor: 'tab_2_accessor',
    },
  ];
  const mockSetActiveTab = jest.fn();

  beforeAll(() => jestPatchMatchMedia());

  let wrapper: Enzyme.ShallowWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>;

  it('should renders EntityContentSection', () => {
    wrapper = mount(<EntityContentSection title={'Title'}>{children}</EntityContentSection>);
    expect(wrapper.exists()).toBe(true);
    wrapper.unmount();
  });

  it('should renders tabs if required', () => {
    wrapper = mount(
      <EntityContentSection title={'Title'} tabs={TABS} setActiveTab={mockSetActiveTab}>
        {children}
      </EntityContentSection>,
    );
    expect(wrapper.find('#tab-tab_1_accessor').length).toBe(1);
    expect(wrapper.find('#tab-tab_2_accessor').length).toBe(1);
    wrapper.unmount();
  });

  it('should not renders tabs if not required', () => {
    wrapper = mount(<EntityContentSection title={'Title'}>{children}</EntityContentSection>);
    expect(wrapper.find('#tab-tab_1_accessor').length).toBe(0);
    expect(wrapper.find('#tab-tab_2_accessor').length).toBe(0);
    wrapper.unmount();
  });

  it('should deactivate tabs that are disabled', () => {
    const tabsWithActive = [
      {
        tabName: 'tab_1',
        accessor: 'tab_1_accessor',
        isDisabled: true,
      },
      {
        tabName: 'tab_2',
        accessor: 'tab_2_accessor',
        isDisabled: false,
      },
    ];
    wrapper = mount(
      <EntityContentSection title={'Title'} tabs={tabsWithActive}>
        {children}
      </EntityContentSection>,
    );
    expect(wrapper.find('#tab-tab_1_accessor').props()['aria-disabled']).toBe('true');
    expect(wrapper.find('#tab-tab_2_accessor').props()['aria-disabled']).toBe('false');
    wrapper.unmount();
  });

  it('should not render tabs is not tabs are enabled', () => {
    const tabsWithActive = [
      {
        tabName: 'tab_1',
        accessor: 'tab_1_accessor',
        isDisabled: true,
      },
      {
        tabName: 'tab_2',
        accessor: 'tab_2_accessor',
        isDisabled: true,
      },
    ];
    wrapper = mount(
      <EntityContentSection title={'Title'} tabs={tabsWithActive}>
        {children}
      </EntityContentSection>,
    );
    expect(wrapper.find('#tab-tab_1_accessor').length).toBe(0);
    expect(wrapper.find('#tab-tab_2_accessor').length).toBe(0);
  });
});
