import React from 'react';
import { Component } from 'react';
import sunburstD3 from './sunburst-d3';
import InfoPanel from './InfoPanel';
import { Phenotype } from 'store/sunburstTypes';
import './sunburst.css';

const RegexHPO = /^.+(\(HP:\d+\)$)/;
const RegexExtractPhenotype = new RegExp(/([A-Z].+?\(HP:\d+\))/, 'g');

type TreeNode = {
  key: string;
  title: React.ReactElement | string;
  children: TreeNode[];
};

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

export const hpoTreeTitleFormat = (splitPheno: PhenotypeSplit) => (
  <div style={{ color: '#515885', fontSize: 14, fontWeight: 400 }}>
    {splitPheno.name}
    <span style={{ color: '#7D84A6', fontSize: 12, fontWeight: 400 }}>{splitPheno.code}</span>
  </div>
);

const splitHPOTerm = (term: string | undefined) => {
  let match;
  if (term) {
    match = RegexHPO.exec(term);
    return {
      name: term.replace(match ? match[1] : '', ' '),
      code: match ? match[1] : '',
    };
  } else {
    return { name: '', code: '' };
  }
};

export const generateInfoTree = (phenotypes: string[]): TreeNode[] => {
  if (!phenotypes.length) {
    return [];
  }

  if (phenotypes.length == 1) {
    const leafPheno = phenotypes.pop();
    const splitPheno = splitHPOTerm(leafPheno);

    return [
      {
        key: leafPheno,
        title: hpoTreeTitleFormat(splitPheno),
        children: [],
      } as TreeNode,
    ];
  }
  const rootPheno = phenotypes.pop();
  const splitPheno = splitHPOTerm(rootPheno);

  return [
    {
      key: rootPheno,
      title: hpoTreeTitleFormat(splitPheno),
      children: generateInfoTree(phenotypes),
    } as TreeNode,
  ];
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
    const treeData: TreeNode[] = generateInfoTree(phenoReversed);
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
    const splitPheno = splitHPOTerm(data.key);
    const rootTreeNode: TreeNode = {
      key: data.key,
      title: hpoTreeTitleFormat(splitPheno),
      children: [],
    };
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
