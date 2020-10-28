import React from 'react';
import { Component } from 'react';
import sunburstD3 from './sunburst-d3';
import InfoPanel from './InfoPanel';
import { Phenotype } from 'store/sunburstTypes';
import './sunburst.css';

type State = {
  selectedPhenotypeInfo: Pick<Phenotype, 'title' | 'results' | 'exactTagCount'>;
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
  results: p.results,
  exactTagCount: p.exactTagCount,
});

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
  };

  getSelectedPhenotype = (phenotype: Phenotype) =>
    this.setState({
      selectedPhenotypeInfo: pickPhenotypeInfo(phenotype),
    });

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

    const { selectedPhenotypeInfo } = this.state;

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
          <InfoPanel data={{ ...selectedPhenotypeInfo }} />
        </div>
      </div>
    );
  }
}

export default Sunburst;
