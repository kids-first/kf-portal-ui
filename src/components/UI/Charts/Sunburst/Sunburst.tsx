import React from 'react';
import { Component } from 'react';
import sunburstD3 from './sunburst-d3';

type SunburstProps = {
  data: Object;
  width?: number;
  height?: number;
  depth?: number;
  tooltipFormatter?: Function; // Received you data item as argument
  centerTextFormatter?: Function; // Received you data item as argument
  colorScheme?: string; // d3 color scheme name e.g. 'schemeSet3'
};

class Sunburst extends Component<SunburstProps, {}> {
  private ref: React.RefObject<SVGSVGElement>;
  static defaultProps = {
    depth: 2,
    width: 300,
    height: 300,
  };
  constructor(props: SunburstProps) {
    super(props);
    this.ref = React.createRef();
  }

  componentDidMount() {
    const { depth, width, height, tooltipFormatter, centerTextFormatter } = this.props;
    const config = {
      depth,
      width,
      height,
    };
    sunburstD3(this.ref, this.props.data as any, config, {
      tooltipFormatter,
      centerTextFormatter,
    });
  }

  render() {
    const { width, height } = this.props;
    return (
      <svg
        style={{ marginTop: '10px' }}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        ref={this.ref}
      ></svg>
    );
  }
}

export default Sunburst;
