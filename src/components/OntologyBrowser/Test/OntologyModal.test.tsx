import React from 'react';
import OntologyModal from '../index';
import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Spinner } from '../../../uikit/Spinner';

configure({ adapter: new Adapter() });

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
    const foundOntologyModal = wrapper.find('OntologyModal');
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
    const foundOntologyModal = wrapper.find('OntologyModal');
    foundOntologyModal.setState({
      selectedKeys: [],
      targetKeys: [],
      isLoading: false,
      error: null,
    });

    expect(foundOntologyModal.state('isLoading')).toEqual(false);
    expect(!foundOntologyModal.find(Spinner).exists());
  });
});
