import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import { withTheme } from 'emotion-theming';
import { compose } from 'recompose';
import isEqual from 'lodash.isequal';
import defaults from 'lodash.defaults';
import { renderPlot } from '@oncojs/survivalplot/index.js';

const SurvivalChartWrapper = styled('div')`
  margin-top: 10px;
`;

const formatDataset = data => {
  return [
    {
      meta: {
        id: '38144623-cbef-435f-9627-e13df0a6ba35',
        state: 'FINISHED',
        count: 37,
        name: 'PAEN-IT',
        description: '',
        type: 'DONOR',
        version: 2,
        timestamp: 1501702607577,
        subtype: 'NORMAL',
      },
      donors: data.donors,
    },
  ];
};

function isElementFullScreen(element) {
  return (
    [
      document.fullscreenElement,
      document.webkitFullscreenElement,
      document.mozFullscreenElement,
    ].indexOf(element) >= 0
  );
}

// @NOTE Because @oncojs/react-survivalplot uses deprecated React.PropTypes
class SurvivalPlot extends React.Component {
  state = {
    xDomain: undefined,
    disabledDataSets: undefined,
  };

  static propTypes = {
    className: PropTypes.string,
    dataSets: PropTypes.array.isRequired,
    palette: PropTypes.array,
    censoredStatuses: PropTypes.array,
    onMouseEnterDonor: PropTypes.func,
    onMouseLeaveDonor: PropTypes.func,
    onClickDonor: PropTypes.func,
    margins: PropTypes.object,
    xAxisLabel: PropTypes.string,
    yAxisLabel: PropTypes.string,
    getSetSymbol: PropTypes.func,
  };

  static defaultProps = {
    palette: ['#1880b2', '#c20127', '#00005d', 'purple'],
    censoredStatuses: ['alive'],
    margins: {
      top: 10,
      right: 0,
      bottom: 46,
      left: 60,
    },
    onMouseEnterDonors(event, donors) {
      console.log({
        donors: donors.map(donor => ({
          ...donor,
          isCensored: this.props.censoredStatuses.indexOf(donor.status) >= 0,
        })),
      });
    },
    onMouseLeaveDonors() {
      console.log('onMouseLeaveDonor');
    },
    onClickDonors(e, donors) {
      console.log('onClickDonor');
    },
    xAxisLabel: 'Survival Rate',
    yAxisLabel: 'Duration (days)',
  };

  stateStack = [];

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
  }

  componentDidUpdate() {
    this.update();
  }

  componentDidMount() {
    this.update();
  }

  updateState = newState => {
    this.stateStack = this.stateStack.concat(this.state);
    this.setState(newState);
  };

  update = params => {
    var state = this.state;
    var container = this._container;

    renderPlot(
      defaults(
        {
          container,
          dataSets: this.props.dataSets,
          disabledDataSets: state.disabledDataSets,
          palette: this.props.palette,
          xDomain: state.xDomain,
          xAxisLabel: 'Duration (days)',
          yAxisLabel: 'Survival Rate',
          height: isElementFullScreen(container) ? window.innerHeight - 100 : 0,
          getSetSymbol: this.props.getSetSymbol,
          onMouseEnterDonor:
            this.props.onMouseEnterDonor && this.props.onMouseEnterDonor.bind(this),
          onMouseLeaveDonor:
            this.props.onMouseLeaveDonor && this.props.onMouseLeaveDonor.bind(this),
          onClickDonor: this.props.onClickDonor,
          onMouseEnterDonors:
            this.props.onMouseEnterDonors && this.props.onMouseEnterDonors.bind(this),
          onMouseLeaveDonors:
            this.props.onMouseLeaveDonors && this.props.onMouseLeaveDonors.bind(this),
          onClickDonors: this.props.onClickDonors,
          onDomainChange: newXDomain => this.updateState({ xDomain: newXDomain }),
          margins: {
            top: 20,
            right: 20,
            bottom: 46,
            left: 60,
          },
        },
        params,
      ),
    );
  };

  render() {
    return <div ref={c => (this._container = c)} className={this.props.className || ''} />;
  }
}

const StyledSurvivalPlot = styled(SurvivalPlot)`
  .axis line,
  .axis path {
    fill: none;
    stroke: #e6dede;
    shape-rendering: crispEdges;
  }
  .axis .tick text {
    fill: #888;
    font-size: 1.5ex;
  }
  .axis .axis-label {
    color: #6b6262;
    font-size: 1.2rem;
    fill: #6b6262;
    font-weight: 500;
  }
  .line {
    fill: none;
    stroke-width: 1.5px;
  }
  .serie .point {
    r: 3;
    -webkit-transition: all 0.1s;
    -o-transition: all 0.1s;
    transition: all 0.1s;
    cursor: pointer;
    stroke-width: none;
  }
  .serie .point:active,
  .serie .point:hover {
    r: 5;
  }
  .serie .point[status='alive'] {
    opacity: 0.5;
  }
  .serie .point[status='deceased'] {
    opacity: 0;
    -webkit-transition: r 0.3s, opacity 0.3s;
    -o-transition: r 0.3s, opacity 0.3s;
    transition: r 0.3s, opacity 0.3s;
    r: 5;
  }
  .serie .point[status='deceased']:active,
  .serie .point[status='deceased']:hover {
    opacity: 1;
    r: 2;
  }
  .serie .point-line {
    cursor: pointer;
  }
  .serie .point-line[status='deceased'] {
    opacity: 0;
  }
  .brush .extent {
    stroke: #fff;
    fill: #edf8ff;
    shape-rendering: crispEdges;
    pointer-events: none;
  }
  .exported-svg-class div {
    position: static !important;
    display: block !important;
  }
  .facet-container {
    -webkit-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
    padding: 10px;
  }
  .facet-container h2 {
    margin-top: 5px;
  }
  .facet-container + .facet-container {
    margin-top: 20px;
  }
`;

class SurvivalChart extends React.Component {
  state = {
    tooltip: {
      donor: {},
      x: 0,
      y: 0,
      isVisible: false,
    },
  };

  handleMouseEnterDonors = (event, donors) => {
    this.setState({
      tooltip: {
        ...this.state.tooltip,
        isVisible: true,
        donor: donors[0],
        x: event.x,
        y: event.y,
      },
    });
  };

  handleMouseLeaveDonors = () => {
    this.setState({
      tooltip: {
        ...this.state.tooltip,
        isVisible: false,
      },
    });
  };

  render() {
    const tooltip = this.state.tooltip;
    const donor = tooltip.donor;
    const tooltipStyle = {
      position: 'absolute',
      top: tooltip.y,
      left: tooltip.x,
      display: tooltip.isVisible ? 'block' : 'none',
      pointerEvents: 'none',
    };
    return (
      <SurvivalChartWrapper>
        <div>Applicable survival data for 35 Participants</div>
        <StyledSurvivalPlot
          dataSets={formatDataset(this.props.data)}
          onMouseEnterDonors={this.handleMouseEnterDonors}
          onMouseLeaveDonors={this.handleMouseLeaveDonors}
        />
        <div style={tooltipStyle}>
          <strong>{donor.id}</strong>
          <div>: {(donor.survivalEstimate * 100).toFixed(2)}%</div>
          {donor.isCensored ? (
            <div>Censored Survival Time: {donor.time} days (censored)</div>
          ) : (
            <div>Survival Time: {donor.time} days </div>
          )}
        </div>
      </SurvivalChartWrapper>
    );
  }
}

export default compose(withTheme)(SurvivalChart);
