import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import { withTheme } from 'emotion-theming';
import { compose } from 'recompose';
import isEqual from 'lodash.isequal';
import defaults from 'lodash.defaults';
import { renderPlot } from '@oncojs/survivalplot/index.dist';
import { CohortCard } from './ui';

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
    onMouseEnterDonors(event, donors) {},
    onMouseLeaveDonors() {},
    onClickDonors(e, donors) {},
    xAxisLabel: 'Survival Rate',
    yAxisLabel: 'Duration (years)',
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
          yAxisLabel: 'Survival Rate',
          xAxisLabel: 'Duration (years)',
          height: isElementFullScreen(container) ? window.innerHeight - 100 : 205,
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
            top: 15,
            right: 20,
            bottom: 50,
            left: 42,
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

const SurvivalChartHeader = styled('div')`
  margin-top: -10px;
  padding: 4px 0 4px 8px;
  background-color: #eee;
  font-size: 11px;
  & a {
    color: ${({ theme }) => theme.chartColors.blue};
  }
`;

const StyledSurvivalPlot = styled(SurvivalPlot)`
  .axis line,
  .axis path {
    fill: none;
    stroke: #e6dede;
    shape-rendering: crispEdges;
  }
  .axis .tick text {
    fill: #888;
    font-size: 10px;
    padding-bottom: 10px;
  }
  .axis .axis-label {
    font-size: 12px;
    font-weight: 500;
    fill: ${({ theme }) => theme.secondary};
  }
  text.axis-label {
    text-anchor: middle !important;
  }
  .axis:first-child .axis-label {
    transform: translateY(7px);
  }
  .axis:nth-child(2) .axis-label {
    transform: rotate(-90deg) translatex(0px) translatey(8px);
  }
  .line {
    fill: none;
    stroke-width: 1.5px;
  }
`;

//     transform: translatey(7px);

class SurvivalChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tooltip: {
        donor: {},
        x: 0,
        y: 0,
        isVisible: false,
      },
    };
    this.handleMouseEnterDonors = this.handleMouseEnterDonors.bind(this);
    this.handleMouseLeaveDonors = this.handleMouseLeaveDonors.bind(this);
  }

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
      border: '2px solid #CCC',
      borderRadius: '10px',
      backgroundColor: '#FFF',
      position: 'absolute',
      top: 70,
      right: 20,
      left: 20,
      padding: '4px',
      display: tooltip.isVisible ? 'block' : 'none',
      pointerEvents: 'none',
      fontSize: '10px',
    };

    return (
      <CohortCard title="Overall Survival" loading={this.props.isParentLoading}>
        <SurvivalChartWrapper>
          <SurvivalChartHeader>
            Applicable survival data for <a>35 Participants</a>
          </SurvivalChartHeader>
          <StyledSurvivalPlot
            dataSets={formatDataset(this.props.data)}
            onMouseEnterDonors={this.handleMouseEnterDonors}
            onMouseLeaveDonors={this.handleMouseLeaveDonors}
          />
          <div style={tooltipStyle}>
            <strong>{donor.id}</strong>
            <div>Survival Rate: {(donor.survivalEstimate * 100).toFixed(2)}%</div>
            {donor.isCensored ? (
              <div>Censored Survival Time: {donor.time} days (censored)</div>
            ) : (
              <div>Survival Time: {donor.time} days </div>
            )}
          </div>
        </SurvivalChartWrapper>
      </CohortCard>
    );
  }
}

export default compose(withTheme)(SurvivalChart);
