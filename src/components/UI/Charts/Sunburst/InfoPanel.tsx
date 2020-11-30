/* eslint-disable react/prop-types */
import React, { FunctionComponent, ReactText } from 'react';
import { generatePhenotypeByTitle, Phenotype } from 'store/sunburstTypes';
import { RootState } from 'store/rootState';
import { connect, ConnectedProps } from 'react-redux';
import { addTermToActiveIndex } from 'store/actionCreators/virtualStudies';
import { ThunkDispatch } from 'redux-thunk';
import { AddTermToActiveIndex, Term } from 'store/virtualStudiesTypes';
import { Button, Tree } from 'antd';
import { TreeNode } from 'components/OntologyBrowser/Model';
import './sunburst.css';
import { RegexExtractPhenotype } from '../../../OntologyBrowser/store';

type OwnProps = {
  data: Pick<Phenotype, 'title' | 'key' | 'results' | 'exactTagCount'>;
  treeData: TreeNode[];
  getSelectedPhenotype: Function;
};

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = OwnProps & PropsFromRedux;

const mapDispatch = (dispatch: ThunkDispatch<RootState, null, AddTermToActiveIndex>) => ({
  onClickAddTermToActiveIndex: (term: Term) => dispatch(addTermToActiveIndex(term)),
});

const connector = connect(null, mapDispatch);

const splitTitle = (title: string) => {
  const [rawTitle, rawCode] = title.split('(HP:');
  return {
    title: rawTitle.trim(),
    hpCode: rawCode ? `HP ${rawCode.replace(')', '').trim()}` : '',
  };
};

export const getPath = (node: string, treeNodes: TreeNode[], path: string[] = []) => {
  const currentNodeText = treeNodes[0].key;
  path.push(currentNodeText);
  if (node !== currentNodeText) {
    getPath(node, treeNodes[0].children, path);
  }
  return path;
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
