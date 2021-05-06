/* eslint-disable react/prop-types */
import React, { FunctionComponent, ReactText } from 'react';
import { connect, ConnectedProps } from 'react-redux';
// @ts-ignore
import { ALL_OP } from '@kfarranger/middleware/dist/constants';
import { Button, Tree } from 'antd';
import { ThunkDispatch } from 'redux-thunk';

import { TreeNode } from 'components/OntologyBrowser/Model';
import { RegexExtractPhenotype } from 'components/OntologyBrowser/store';
import { addTermToActiveIndex } from 'store/actionCreators/virtualStudies';
import { RootState } from 'store/rootState';
import { generatePhenotypeByTitle, Phenotype } from 'store/sunburstTypes';
import { AddTermToActiveIndex, Term } from 'store/virtualStudiesTypes';

import './sunburst.css';

type OwnProps = {
  data: Pick<Phenotype, 'title' | 'key' | 'results' | 'exactTagCount'>;
  treeData: TreeNode[];
  getSelectedPhenotype: Function;
};

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = OwnProps & PropsFromRedux;

const mapDispatch = (dispatch: ThunkDispatch<RootState, null, AddTermToActiveIndex>) => ({
  onClickAddTermToActiveIndex: (term: Term) => dispatch(addTermToActiveIndex(term, ALL_OP)),
});

const connector = connect(null, mapDispatch);

const splitTitle = (title: string) => {
  const [rawTitle, rawCode] = title.split('(HP:');
  return {
    title: rawTitle.trim(),
    hpCode: rawCode ? `HP ${rawCode.replace(')', '').trim()}` : '',
  };
};

export const getPath = (node: string, treeNodes: TreeNode[], path: string[] = []): string[] => {
  const updatePath = [...path];
  const currentNodeText = treeNodes[0].key;
  updatePath.push(currentNodeText);
  if (node !== currentNodeText) {
    return getPath(node, treeNodes[0].children, updatePath);
  }
  return updatePath;
};

const generateNodeIdClicked = (
  nodeName: ReactText[],
  treeData: TreeNode[],
  getSelectedPhenotype: Function,
) => {
  const path = getPath(nodeName[0] as string, treeData);
  const phenotype = generatePhenotypeByTitle(nodeName[0] as string, path.join('-'));
  getSelectedPhenotype(phenotype);
  return path.join('-');
};

const InfoPanel: FunctionComponent<Props> = ({
  data,
  onClickAddTermToActiveIndex,
  treeData,
  getSelectedPhenotype,
}) => {
  const { title, key, results, exactTagCount } = data;
  const titleCode = splitTitle(title);

  return (
    <div className={'info-panel-grid-container'}>
      <div className={'term-grid'}>
        <div className={'term-grid-item'}>
          <span className={'main-term-title'}>{titleCode.title}</span>
          <span className={'hp'}>{` ${titleCode.hpCode}`}</span>
        </div>
        <div className={'term-grid-item count-text'}>
          {`${results} participants (including descendant terms on this path)`}
        </div>
        <div className={'term-grid-item count-text'}>
          {`${exactTagCount} participants with this exact term`}
        </div>
        <div>
          <Button
            onClick={() =>
              onClickAddTermToActiveIndex({ field: 'observed_phenotype.name', value: title })
            }
            type="text"
            className={'add-to-query'}
          >
            Add term to active query
          </Button>
        </div>
      </div>
      <div className={'tree-grid'}>
        <div className={'tree-title'}>Current Path</div>
        <Tree
          treeData={treeData}
          expandedKeys={key.match(RegexExtractPhenotype) || []}
          switcherIcon={<div />}
          className={'sunburst-phenotypes-tree'}
          onSelect={(node) =>
            node.length ? generateNodeIdClicked(node, treeData, getSelectedPhenotype) : {}
          }
        />
      </div>
    </div>
  );
};
const Connected = connector(InfoPanel);

export default Connected;
