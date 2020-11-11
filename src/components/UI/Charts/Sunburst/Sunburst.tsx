import React from 'react';
import { Component } from 'react';
import sunburstD3 from './sunburst-d3';
import InfoPanel from './InfoPanel';
import { Phenotype } from 'store/sunburstTypes';
import './sunburst.css';
import {
  generateNavTreeFormKey,
  RegexExtractPhenotype,
  splitHPOTerm,
} from 'components/OntologyBrowser/store';
import { lightTreeNodeConstructor, TreeNode } from 'components/OntologyBrowser/Model';

type PhenotypeSplit = {
  name: string;
  code: string;
};

type State = {
  selectedPhenotypeInfo: Pick<Phenotype, 'title' | 'key' | 'results' | 'exactTagCount'>;
  phenotypeTree: TreeNode[];
};

type SunburstProps = {
  data: Phenotype;
  width?: number;
  height?: number;
  depth?: number;
  tooltipFormatter?: Function; // Received you data item as argument
  centerTextFormatter?: Function; // Received you data item as argument
  colorScheme?: string; // d3 color scheme name e.g. 'schemeSet3'
  isEmpty: boolean;
};

const pickPhenotypeInfo = (p: Phenotype) => ({
  title: p.title,
  key: p.key,
  results: p.results,
  exactTagCount: p.exactTagCount,
});

export const hpoTreeTitleFormat = (splitPheno: PhenotypeSplit, currentTerm: string) => {
  const currentPhenoCode = splitHPOTerm(currentTerm).code;
  return (
    <div className={`hpo-tree-name ${currentPhenoCode === splitPheno.code ? 'hpo-tree-bold' : ''}`}>
      {splitPheno.name}
      <span className={'hpo-tree-code'}>{`${splitPheno.code.replace('HP:', 'HP ')}`}</span>
    </div>
  );
};

class Sunburst extends Component<SunburstProps, State> {
  private readonly ref: React.RefObject<SVGSVGElement>;
  static defaultProps = {
    depth: 2,
    width: 300,
    height: 300,
    isEmpty: false,
  };
  constructor(props: SunburstProps) {
    super(props);
    this.ref = React.createRef();
  }

  state = {
    selectedPhenotypeInfo: pickPhenotypeInfo(this.props.data),
    phenotypeTree: [],
  };

  getSelectedPhenotype = (phenotype: Phenotype) => {
    const phenotypes = phenotype.key.match(RegexExtractPhenotype);
    const phenoReversed = (phenotypes || []).reverse();
    const treeData: TreeNode[] = generateNavTreeFormKey(phenoReversed, phenotype.title);
    this.setState({
      selectedPhenotypeInfo: pickPhenotypeInfo(phenotype),
      phenotypeTree: treeData,
    });
  };

  componentDidMount() {
    const { depth, width, height, tooltipFormatter, centerTextFormatter, data } = this.props;
    const config = {
      depth,
      width,
      height,
    };
    sunburstD3(this.ref, data, config, this.getSelectedPhenotype, {
      tooltipFormatter,
      centerTextFormatter,
    });
    const rootTreeNode: TreeNode = lightTreeNodeConstructor(data.key, data.key);

    this.setState({ phenotypeTree: [rootTreeNode] });
  }

  render() {
    const { width, height, isEmpty } = this.props;

    if (isEmpty) {
      return (
        <svg
          style={{ marginTop: '10px' }}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          ref={this.ref}
        />
      );
    }

    const { selectedPhenotypeInfo, phenotypeTree } = this.state;

    return (
      <div className={'grid-container'}>
        <svg
          className={'grid-item'}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          ref={this.ref}
        />
        <div className={'grid-item'}>
          <InfoPanel data={{ ...selectedPhenotypeInfo }} treeData={phenotypeTree} />
        </div>
      </div>
    );
  }
}

export default Sunburst;
