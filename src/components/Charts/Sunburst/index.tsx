import React from 'react';
import { Component } from 'react';
import sunburstD3 from './sunburst-d3';

type SunburstProps = {
  data: Object;
  width?: number;
  depth?: number;
  tooltipFormatter?: Function;
  centerTextFormatter?: Function;
  colorScheme?: string; // d3 color scheme name e.g. 'schemeSet3'
};

class Sunburst extends Component<SunburstProps, {}> {
  private ref: React.RefObject<SVGSVGElement>;
  static defaultProps = {
    depth: 2,
    width: 300,
  };
  constructor(props: SunburstProps) {
    super(props);
    this.ref = React.createRef();
  }

  componentDidMount() {
    const { depth, width, tooltipFormatter, centerTextFormatter } = this.props;
    const config = {
      depth,
      width,
    };
    sunburstD3(this.ref, this.props.data as any, config, {
      tooltipFormatter,
      centerTextFormatter,
    });
  }

  render() {
    return (
      <svg
        id="partitionSVG"
        style={{ marginTop: '10px' }}
        width="300"
        height="300"
        viewBox="0 0 300 300"
        ref={this.ref}
      ></svg>
    );
  }
}

export default Sunburst;
