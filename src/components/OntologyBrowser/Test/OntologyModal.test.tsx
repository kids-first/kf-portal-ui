import React from 'react';
import OntologyModal from '../index';
import { configure, mount, ReactWrapper, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Spinner } from '../../../uikit/Spinner';
import { Sqon, SqonFilters } from '../../../types';
import { PhenotypeStore } from '../store';
import { treeData } from './mockData';

configure({ adapter: new Adapter() });

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('Ontology Modal', () => {
  const props = {
    isVisible: true,
    initialSqon: { op: 'and', content: [] },
    title: 'Clinical',
    selectedField: 'observed_phenotype.name',
    onSqonUpdate: jest.fn(),
    onCloseModal: jest.fn(),
  };

  let wrapper: ReactWrapper;

  beforeEach(() => {
    wrapper = mount(<OntologyModal {...props} />);
  });

  afterAll(() => {
    wrapper.unmount();
  });

  it('should render Ontology Modal', () => {
    expect(wrapper.length).toEqual(1);
  });

  it('should display a Spinner when Ontology Modal is in a loading state', () => {
    const foundOntologyModal = wrapper; // .find('OntologyModal');
    foundOntologyModal.setState({
      selectedKeys: [],
      targetKeys: [],
      isLoading: true,
      error: null,
    });

    expect(foundOntologyModal.state('isLoading')).toEqual(true);
    expect(foundOntologyModal.find(Spinner).exists());
  });

  it('should not display a Spinner when Ontology Modal is not in a loading state', () => {
    const foundOntologyModal = wrapper; //.find('OntologyModal');
    foundOntologyModal.setState({
      selectedKeys: [],
      targetKeys: [],
      isLoading: false,
      error: null,
    });

    expect(foundOntologyModal.state('isLoading')).toEqual(false);
    expect(!foundOntologyModal.find(Spinner).exists());
  });

  it('should getKeysFromSqon even from combined queries', () => {
    const sqonFilter: SqonFilters = {
      op: 'and',
      content: {
        field: 'this.field',
        value: [
          'Skin appendage neoplasm (HP:0012842)',
          'Abnormality of skin morphology (HP:0011121)',
        ],
      },
    };

    const sqon: Sqon = {
      op: 'single',
      content: [sqonFilter],
    };

    const sqonCombinedQueries = {
      op: 'combined',
      content: [sqon, sqon],
    };

    const wrapperInstance = shallow<
      OntologyModal,
      {
        initialSqon: Sqon;
        onSqonUpdate: Function;
        title: string;
        selectedField: string;
      },
      {}
    >(
      <OntologyModal
        initialSqon={sqon}
        isVisible
        onCloseModal={jest.fn()}
        onSqonUpdate={jest.fn()}
        selectedField={'this.field'}
        title={'title'}
      />,
    );
    const wrapperInstanceCombine = shallow<
      OntologyModal,
      {
        initialSqon: Sqon;
        onSqonUpdate: Function;
        title: string;
        selectedField: string;
      },
      {}
    >(
      <OntologyModal
        initialSqon={sqonCombinedQueries}
        isVisible
        onCloseModal={jest.fn()}
        onSqonUpdate={jest.fn()}
        selectedField={'this.field'}
        title={'title'}
      />,
    );

    const expectedResult = [
      'Abnormality of the integument (HP:0001574)-Abnormality of the skin (HP:0000951)-' +
        'Abnormality of skin morphology (HP:0011121)',
      'Abnormality of the integument (HP:0001574)-' +
        'Abnormality of skin adnexa morphology (HP:0011138)-' +
        'Skin appendage neoplasm (HP:0012842)',
    ];

    const t = new PhenotypeStore();
    t.tree = treeData;

    wrapperInstance.instance().ontologyStore = t;

    expect(wrapperInstance.instance().getKeysFromSqon().sort()).toEqual(expectedResult.sort());
    expect(wrapperInstanceCombine.instance().getKeysFromSqon().sort()).toEqual([]);
  });
});
