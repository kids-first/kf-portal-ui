import React from 'react';
import { Provider } from 'react-redux';
import { shallow, ShallowWrapper } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { treeData } from 'components/OntologyBrowser/Test/mockData';
import Sunburst from 'components/UI/Charts/Sunburst';

const middleware = [thunk];
const mockStore = configureStore(middleware);

/*
*   <ContextProvider ...values...>
      <Sunburst ...props... />
    </ContextProvider>
* */
const getSunburstChildrenFromProvider = (w: ShallowWrapper) => w.dive().dive();

describe('Sunburst', () => {
  const store = mockStore({});
  const shallowWithProvider = (sunburstProps = {}) =>
    shallow(
      <Provider store={store}>
        <Sunburst data={treeData[0]} tooltipFormatter={() => {}} {...sunburstProps} />
      </Provider>,
    );

  let wrapper: ShallowWrapper;

  it('should render with default values', () => {
    wrapper = shallowWithProvider();
    expect(wrapper).toBeDefined();

    const SunburstChildren = getSunburstChildrenFromProvider(wrapper);
    expect(SunburstChildren).toBeDefined();

    const Svg = SunburstChildren.find('svg');
    expect(Svg.exists()).toBeTruthy();
    expect(Svg.prop('width')).toEqual(300);
    expect(Svg.prop('height')).toEqual(300);
    expect(Svg.prop('viewBox')).toEqual('0 0 300 300');
  });
});
