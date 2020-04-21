import { TreeNode } from '../store';
import { SelectionTree } from '../SelectionTree';
import * as React from 'react';
import Enzyme, {shallow, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { treeData } from './mockData';

Enzyme.configure({adapter: new Adapter()});

describe('In SelectionTree', () => {
  const checkedKeys: string[] = [];
  const targetKeys: string[] = [];
  const onItemSelect = jest.fn();
  const dataSource: TreeNode[] = treeData

  beforeAll(() => {
  });

  it('should renders selection tree', () => {
    const component = mount(<SelectionTree
      dataSource={dataSource}
      checkedKeys={checkedKeys}
      onItemSelect={onItemSelect}
      targetKeys={targetKeys}
    />);
    expect(component.exists()).toBe(true)
    component.unmount();
  });

  it('should return expected result', () => {
    const expectedResult: TreeNode[] = [
      {
        title: 'Abnormality of the integument (HP:0001574)',
        text: 'Abnormality of the integument (HP:0001574)',
        key: 'Abnormality of the integument (HP:0001574)',
        hidden: false,
        children: [
          {
            title: 'Abnormality of the skin (HP:0000951)',
            text: 'Abnormality of the skin (HP:0000951)',
            key: 'Abnormality of the integument (HP:0001574)-Abnormality of the skin (HP:0000951)',
            hidden: true,
            children: [
              {
                title: 'Abnormality of skin morphology (HP:0011121)',
                text: 'Abnormality of skin morphology (HP:0011121)',
                key: 'Abnormality of the integument (HP:0001574)-Abnormality of the skin (HP:0000951)-Abnormality of skin morphology (HP:0011121)',
                hidden: true,
                children: [],
              },
            ],

          },
          {
            title: <span>Abnormality of skin <b>adnexa</b> morphology (HP:0011138)</span>,
            text: 'Abnormality of skin adnexa morphology (HP:0011138)',
            key: 'Abnormality of the integument (HP:0001574)-Abnormality of skin adnexa morphology (HP:0011138)',
            hidden: false,
            children: [
              {
                title: 'Skin appendage neoplasm (HP:0012842)',
                text: 'Skin appendage neoplasm (HP:0012842)',
                key: 'Abnormality of the integument (HP:0001574)-Abnormality of skin adnexa morphology (HP:0011138)-Skin appendage neoplasm (HP:0012842)',
                hidden: true,
                children: [],
              },
              {
                title: 'Abnormal hair morphology (HP:0001595)',
                text: 'Abnormal hair morphology (HP:0001595)',
                key: 'Abnormality of the integument (HP:0001574)-Abnormality of skin adnexa morphology (HP:0011138)-Abnormal hair morphology (HP:0001595)',
                hidden: true,
                children: [],
              },
              {
                title: 'Custom term xyz',
                text: 'Custom term xyz',
                key: 'Abnormality of the integument (HP:0001574)-Abnormality of skin adnexa morphology (HP:0011138)-Custom term xyz',
                hidden: true,
                children: [],
              },
            ],
          },
        ],
      },
    ];

    const event = {
      target: { value: 'adne' },
    } as React.ChangeEvent<HTMLInputElement>;

    const component = shallow(<SelectionTree
      dataSource={dataSource}
      checkedKeys={checkedKeys}
      onItemSelect={onItemSelect}
      targetKeys={targetKeys}
    />);

    component.find('Input').simulate('change', event);
    expect(component.state().treeData).toEqual(expectedResult);
  });

  it('should only call search in tree for 3 or more characters', () => {
    const event = {
      target: { value: 'ad' },
    } as React.ChangeEvent<HTMLInputElement>;

    const component = shallow(<SelectionTree
      dataSource={dataSource}
      checkedKeys={checkedKeys}
      onItemSelect={onItemSelect}
      targetKeys={targetKeys}
    />);

    component.find('Input').simulate('change', event);
    expect(component.state().expandedKeys).toEqual(['Abnormality of the integument (HP:0001574)']);
  });

  it('should searchInTree method should return results as expected', () => {
    const event = {
      target: { value: 'ad' },
    } as React.ChangeEvent<HTMLInputElement>;

    const component = shallow(<SelectionTree
      dataSource={dataSource}
      checkedKeys={checkedKeys}
      onItemSelect={onItemSelect}
      targetKeys={targetKeys}
    />);

    //Query with from beginning of a term: 'Skin appendage neoplasm (HP:0012842)'
    const resStart = component.instance().searchInTree('Ski', dataSource[0]);
    expect(resStart).toBe(true);
    //Query with from beginning of a term: 'Custom term xyz'
    const resEnd = component.instance().searchInTree('xyz', dataSource[0]);
    expect(resEnd).toBe(true);
    //Query with parenthesis - will be cleaned out'
    const resParenthesis = component.instance().searchInTree('(HP:0012842)', dataSource[0]);
    expect(resParenthesis).toBe(true);
    //Query with terms not existing will return false
    const resNotFound = component.instance().searchInTree('NOTTHERE', dataSource[0]);
    expect(resNotFound).toBe(false);
    //Query for multiple words: 'Abnormality of skin morphology (HP:0011121)'
    const resMultiWords = component.instance().searchInTree('skin mor', dataSource[0]);
    expect(resMultiWords).toBe(true);
  });
});
