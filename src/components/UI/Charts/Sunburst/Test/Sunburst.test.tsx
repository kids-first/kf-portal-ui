import React from 'react';
import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Sunburst from 'components/UI/Charts/Sunburst';
import { treeData } from 'components/OntologyBrowser/Test/mockData';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { generateInfoTree } from '../Sunburst';
import { expect } from 'chai';

configure({ adapter: new Adapter() });

const middleware = [thunk];
const mockStore = configureStore(middleware);

describe('Sunburst', () => {
  let wrapper: ReactWrapper;

  const mountWithProvider = (fakeStore: any, sunburstProps = {}) =>
    mount(
      <Provider store={fakeStore}>
        <Sunburst data={treeData[0]} tooltipFormatter={() => {}} {...sunburstProps} />
      </Provider>,
    );

  afterAll(() => {
    wrapper.unmount();
  });

  it('should render', () => {
    const store = mockStore({});
    wrapper = mountWithProvider(store);
    expect(wrapper.length).toEqual(1);
    expect(wrapper.find('svg').exists()).toBeTruthy();
    expect(wrapper.find('svg').prop('width')).toEqual(300);
  });

  it('should render width default value', () => {
    expect(wrapper.find('svg').prop('width')).toEqual(300);
    expect(wrapper.find('svg').prop('height')).toEqual(300);
    expect(wrapper.find('svg').prop('viewBox')).toEqual('0 0 300 300');
  });

  it('should render width custom value', () => {
    const store = mockStore({});
    wrapper = mountWithProvider(store, { width: 400, height: 450 });
    // wrapper.setProps({ width: 400, height: 450 });
    expect(wrapper.find('svg').prop('width')).toEqual(400);
    expect(wrapper.find('svg').prop('height')).toEqual(450);
    expect(wrapper.find('svg').prop('viewBox')).toEqual('0 0 400 450');
  });
});

describe('Sunburst generateInfoTree method', () => {
  it('should render tree data', () => {
    const inputPhenotype = 'Aaa (HP:0001)-Bbb (HP:0002)-Ccc (HP:0003)';
    const phenotypes = inputPhenotype.split('-').reverse();
    const result = generateInfoTree(phenotypes);

    const expectedResult = [
      {
        key: 'Aaa',
        title: (
          <div>
            Aaa<span style={{ color: 'red' }}>HP:0001</span>
          </div>
        ),
        children: [
          {
            key: 'Bbb',
            title: (
              <div>
                Bbb<span style={{ color: 'red' }}>HP:0002</span>
              </div>
            ),
            children: [
              {
                key: 'Ccc',
                title: (
                  <div>
                    Ccc<span style={{ color: 'red' }}>HP:0003</span>
                  </div>
                ),
                children: [],
              },
            ],
          },
        ],
      },
    ];

    expect(result).to.be.deep.equal(expectedResult);
  });
});
