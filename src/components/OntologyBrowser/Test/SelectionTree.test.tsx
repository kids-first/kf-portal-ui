import * as React from 'react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme, { shallow, ShallowWrapper } from 'enzyme';

import { jestPatchMatchMedia } from '../../../utils';
import { TreeNode } from '../Model';
import { SelectionTree } from '../SelectionTree';

import { treeData } from './mockData';

Enzyme.configure({ adapter: new Adapter() });

describe('In SelectionTree', () => {
  const checkedKeys: string[] = [];
  const targetKeys: string[] = [];
  const onItemSelect = jest.fn();
  const onItemSelectAll = jest.fn();
  const dataSource: TreeNode[] = treeData;

  beforeAll(() => jestPatchMatchMedia());

  let wrapper: ShallowWrapper<
    {},
    {
      treeData: TreeNode[];
      expandedKeys: string[];
    },
    SelectionTree
  >;

  const wrapperInstance = shallow<SelectionTree, {}, {}>(
    <SelectionTree
      checkedKeys={[]}
      dataSource={[]}
      onItemSelect={jest.fn()}
      onItemSelectAll={jest.fn()}
      targetKeys={[]}
      selectedField={''}
    />,
  );

  beforeEach(() => {
    wrapper = shallow<
      SelectionTree,
      {},
      {
        treeData: TreeNode[];
        expandedKeys: string[];
      }
    >(
      <SelectionTree
        dataSource={dataSource}
        checkedKeys={checkedKeys}
        onItemSelect={onItemSelect}
        targetKeys={targetKeys}
        onItemSelectAll={onItemSelectAll}
        selectedField={''}
      />,
    );
  });

  it('should renders selection tree', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should return expected TreeNode', () => {
    const expectedResult: TreeNode[] = [
      {
        title: 'Abnormality of the integument (HP:0001574)',
        text: 'Abnormality of the integument (HP:0001574)',
        key: 'Abnormality of the integument (HP:0001574)',
        hidden: false,
        results: 100,
        exactTagCount: 0,
        valueText: 2120,
        children: [
          {
            title: 'Abnormality of the skin (HP:0000951)',
            text: 'Abnormality of the skin (HP:0000951)',
            key: 'Abnormality of the integument (HP:0001574)-Abnormality of the skin (HP:0000951)',
            hidden: true,
            results: 6,
            exactTagCount: 2,
            valueText: 1960,
            value: 1954,
            children: [
              {
                title: 'Abnormality of skin morphology (HP:0011121)',
                text: 'Abnormality of skin morphology (HP:0011121)',
                key:
                  'Abnormality of the integument (HP:0001574)-Abnormality of the skin (HP:0000951)-' +
                  'Abnormality of skin morphology (HP:0011121)',
                hidden: true,
                results: 4,
                exactTagCount: 4,
                valueText: 1960,
                children: [
                  {
                    title: 'Skin appendage neoplasm (HP:0012842)',
                    text: 'Skin appendage neoplasm (HP:0012842)',
                    key:
                      'Abnormality of the integument (HP:0001574)-Abnormality of the skin (HP:0000951)' +
                      '-Abnormality of skin morphology (HP:0011121)' +
                      'Skin appendage neoplasm (HP:0012842)',
                    results: 2,
                    exactTagCount: 2,
                    children: [],
                    hidden: true,
                    valueText: 1960,
                    value: 1960,
                  },
                ],
              },
            ],
          },
          {
            title: (
              <span>
                {'Abnormality of skin '}
                <div className="highlight" style={{ display: 'inherit' }}>
                  adnexa
                </div>
                {' morphology (HP:0011138)'}
              </span>
            ),
            text: 'Abnormality of skin adnexa morphology (HP:0011138)',
            key:
              'Abnormality of the integument (HP:0001574)-Abnormality of skin adnexa morphology (HP:0011138)',
            hidden: false,
            results: 6,
            exactTagCount: 1,
            valueText: 160,
            children: [
              {
                title: 'Skin appendage neoplasm (HP:0012842)',
                text: 'Skin appendage neoplasm (HP:0012842)',
                key:
                  'Abnormality of the integument (HP:0001574)-' +
                  'Abnormality of skin adnexa morphology (HP:0011138)-' +
                  'Skin appendage neoplasm (HP:0012842)',
                hidden: false,
                results: 2,
                exactTagCount: 2,
                valueText: 12,
                value: 12,
                children: [],
              },
              {
                title: 'Abnormal hair morphology (HP:0001595)',
                text: 'Abnormal hair morphology (HP:0001595)',
                key:
                  'Abnormality of the integument (HP:0001574)-' +
                  'Abnormality of skin adnexa morphology (HP:0011138)-' +
                  'Abnormal hair morphology (HP:0001595)',
                hidden: false,
                results: 2,
                exactTagCount: 2,
                valueText: 24,
                value: 24,
                children: [],
              },
              {
                title: 'Custom term xyz',
                text: 'Custom term xyz',
                key:
                  'Abnormality of the integument (HP:0001574)-' +
                  'Abnormality of skin adnexa morphology (HP:0011138)-Custom term xyz',
                hidden: false,
                results: 1,
                exactTagCount: 1,
                valueText: 112,
                value: 112,
                children: [],
              },
            ],
          },
        ],
      },
    ];

    const event = {
      target: { value: 'adnexa' },
    } as React.ChangeEvent<HTMLInputElement>;

    wrapper.find('Input').simulate('change', event);
    expect(wrapper.state().treeData).toEqual(expectedResult);
  });

  it('should only call search in tree for 3 or more characters', () => {
    const event = {
      target: { value: 'ad' },
    } as React.ChangeEvent<HTMLInputElement>;

    wrapper.find('Input').simulate('change', event);
    expect(wrapper.state().expandedKeys).toEqual(['Abnormality of the integument (HP:0001574)']);
  });

  it('should searchInTree method should return results as expected', () => {
    //Query with from beginning of a term: 'Skin appendage neoplasm (HP:0012842)'
    const resStart = wrapperInstance.instance().searchInTree('Ski', dataSource[0]);
    expect(resStart).toBe(true);
    // Query with from beginning of a term: 'Custom term xyz'
    const resEnd = wrapperInstance.instance().searchInTree('xyz', dataSource[0]);
    expect(resEnd).toBe(true);
    //Query with parenthesis - will be cleaned out'
    const resParenthesis = wrapperInstance.instance().searchInTree('(HP:0012842)', dataSource[0]);
    expect(resParenthesis).toBe(true);
    //Query with terms not existing will return false
    const resNotFound = wrapperInstance.instance().searchInTree('NOTTHERE', dataSource[0]);
    expect(resNotFound).toBe(false);
    //Query for multiple words: 'Abnormality of skin morphology (HP:0011121)'
    const resMultiWords = wrapperInstance.instance().searchInTree('skin mor', dataSource[0]);
    expect(resMultiWords).toBe(true);
  });

  it('should get checked keys for selected items', () => {
    const resStart = wrapperInstance
      .instance()
      .checkKeys(
        'Abnormality of the integument (HP:0001574)-' +
          'Abnormality of skin adnexa morphology (HP:0011138)-' +
          'Skin appendage neoplasm (HP:0012842)',
        treeData,
      );
    expect(resStart).toStrictEqual({
      check: [
        'Abnormality of the integument (HP:0001574)-' +
          'Abnormality of skin adnexa morphology (HP:0011138)-' +
          'Skin appendage neoplasm (HP:0012842)',
      ],
      halfcheck: [
        'Abnormality of the integument (HP:0001574)-' +
          'Abnormality of skin adnexa morphology (HP:0011138)',
        'Abnormality of the integument (HP:0001574)',
      ],
    });
  });
});
