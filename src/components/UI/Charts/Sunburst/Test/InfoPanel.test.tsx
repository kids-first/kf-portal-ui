import React from 'react';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { treeData } from 'components/OntologyBrowser/Test/mockData';
import InfoPanel from 'components/UI/Charts/Sunburst';
import { generateEmptyPhenotype } from 'store/sunburstTypes';

import { getPath } from '../InfoPanel';

const middleware = [thunk];
const mockStore = configureStore(middleware);

describe('Info Panel', () => {
  const store = mockStore({});

  const shallowWithProvider = (sunburstProps = {}) =>
    shallow(
      <Provider store={store}>
        <InfoPanel
          data={generateEmptyPhenotype()}
          treeData={treeData[0]}
          getSelectedPhenotype={() => {}}
          {...sunburstProps}
        />
      </Provider>,
    );

  it('should render', async () => {
    const wrapper = shallowWithProvider();
    expect(wrapper).toBeDefined();
  });
});

describe('getPath', () => {
  it('should do stuff', () => {
    const node =
      'Abnormality of the integument (HP:0001574)-Abnormality of the skin (HP:0000951)' +
      '-Abnormality of skin morphology (HP:0011121)';

    const result = getPath(node, treeData);

    const expectedOutput = [
      'Abnormality of the integument (HP:0001574)',
      'Abnormality of the integument (HP:0001574)-Abnormality of the skin (HP:0000951)',
      'Abnormality of the integument (HP:0001574)-Abnormality of the skin (HP:0000951)' +
        '-Abnormality of skin morphology (HP:0011121)',
    ];

    expect(result).toEqual(expectedOutput);
  });
});
