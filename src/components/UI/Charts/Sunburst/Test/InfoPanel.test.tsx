import React from 'react';
import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import InfoPanel from 'components/UI/Charts/Sunburst';
import { treeData } from 'components/OntologyBrowser/Test/mockData';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { generateEmptyPhenotype } from 'store/sunburstTypes';
import { getPath } from '../InfoPanel';

configure({ adapter: new Adapter() });

const middleware = [thunk];
const mockStore = configureStore(middleware);

describe('Info Panel', () => {
  let wrapper: ReactWrapper;

  const mountWithProvider = (fakeStore: any, sunburstProps = {}) =>
    mount(
      <Provider store={fakeStore}>
        <InfoPanel
          data={generateEmptyPhenotype()}
          treeData={treeData[0]}
          getSelectedPhenotype={() => {}}
          {...sunburstProps}
        />
      </Provider>,
    );

  afterAll(() => {
    wrapper.unmount();
  });

  it('should render', () => {
    const store = mockStore({});
    wrapper = mountWithProvider(store);
    expect(wrapper.length).toEqual(1);
  });
});

describe('getPath', () => {
  it('should do stuff', () => {
    const node =
      'Abnormality of the integument (HP:0001574)-Abnormality of the skin (HP:0000951)' +
      '-Abnormality of skin morphology (HP:0011121)';
    const treeNodeInput = treeData;

    const result = getPath(node, treeNodeInput);

    const expectedOutput = [
      'Abnormality of the integument (HP:0001574)',
      'Abnormality of the integument (HP:0001574)-Abnormality of the skin (HP:0000951)',
      'Abnormality of the integument (HP:0001574)-Abnormality of the skin (HP:0000951)' +
        '-Abnormality of skin morphology (HP:0011121)',
    ];

    // const store = mockStore({});
    // wrapper = mountWithProvider(store);
    expect(result).toEqual(expectedOutput);
  });
});
