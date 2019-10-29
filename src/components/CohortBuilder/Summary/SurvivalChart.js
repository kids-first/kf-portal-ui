import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import { isEqual, defaults, get, has } from 'lodash';
import { renderPlot } from '@oncojs/survivalplot/index.dist';
import { CohortCard } from './ui';
import { fetchSurvivalData } from 'services/arranger';
import md5 from 'md5';
import CardContent from 'uikit/Card/CardContent';
import { SizeProvider } from 'components/Utils';
import { compose } from 'recompose';
import { withApi } from 'services/api';
import ResetIcon from 'react-icons/lib/md/replay';
import Tooltip from 'uikit/Tooltip';

const SurvivalChartWrapper = styled('div')`
  margin-top: 10px;
`;

const formatDataset = data => {
  return [
    {
      meta: {
        id: '38144623-cbef-435f-9627-e13df0a6ba35',
        state: 'FINISHED',
        count: get(data, 'donors.length', 0),
        name: 'PAEN-IT',
        description: '',
        type: 'DONOR',
        version: 2,
        timestamp: Date.now(),
        subtype: 'NORMAL',
      },
      donors: get(data, 'donors', []),
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
    disableResetButton: PropTypes.func,
    margins: PropTypes.object,
    xAxisLabel: PropTypes.string,
    yAxisLabel: PropTypes.string,
    getSetSymbol: PropTypes.func,
    sqon: PropTypes.object,
    resetZoom: PropTypes.bool,
  };

  static defaultProps = {
    palette: ['#1880b2', '#c20127', '#00005d', 'purple'],
    censoredStatuses: ['alive'],
    onMouseEnterDonors(event, donors) {},
    onMouseLeaveDonors() {},
    disableResetButton() {},
    onClickDonors(e, donors) {},
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.resetZoom !== this.props.resetZoom) {
      const newState = { xDomain: undefined };
      this.setState(newState);
    }
  }

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
          xAxisLabel: 'Duration (days)',
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
          onDomainChange: newXDomain => {
            this.props.disableResetButton() && this.props.disableResetButton.bind(this);
            this.updateState({ xDomain: newXDomain });
          },
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

const SurvivalCardContent = styled(CardContent)`
  overflow: visible;
`;

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

  .brush .extent {
    stroke: #fff;
    fill: #edf8ff;
    shape-rendering: crispEdges;
  }
`;

export class SurvivalChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tooltip: {
        donor: {},
        x: 0,
        y: 0,
        isVisible: false,
      },
      isLoading: true,
      data: [],
      resetZoom: false,
      zoomDisabled: true,
    };
  }

  queryCacheMap = {};
  cachedFetch = () => {
    const { api, sqon } = this.props;
    const hash = md5(JSON.stringify(sqon));
    return new Promise((resolve, reject) => {
      if (has(this.queryCacheMap, hash)) {
        resolve(this.queryCacheMap[hash]);
      } else {
        fetchSurvivalData(api)(sqon)
          .then(data => {
            const formattedData = formatDataset(data);
            this.queryCacheMap[hash] = formattedData;
            resolve(formattedData);
          })
          .catch(err => reject(err));
      }
    });
  };

  // The fetchCount is incremented with every fetch
  //   Checking the fetchCount before setting the fetched data into state
  //   prevents a slow running query loading over a more recent query
  fetchCount = 0;
  updateData = () => {
    const checkCount = ++this.fetchCount;

    this.cachedFetch()
      .then(data => {
        if (this.fetchCount === checkCount) {
          this.setState({ data, isLoading: false });
        }
      })
      .catch(err => {
        console.log(`Error fetching survival data: ${err}`);
        this.setState({ data: [], isLoading: false });
        // should be an error state, but for now /survival endpoint not handling [] well
      });
  };

  componentDidMount() {
    this.setState({ isLoading: true });
    this.updateData();
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.sqon, prevProps.sqon)) {
      this.setState({ isLoading: true });
      this.updateData();
    }
  }

  handleMouseEnterDonors = (event, donors) => {
    this.setState(prevState => ({
      tooltip: {
        ...prevState.tooltip,
        isVisible: true,
        donor: donors[0],
        x: event.offsetX,
        y: event.offsetY,
      },
    }));
  };

  handleMouseLeaveDonors = (event, donors) => {
    this.setState(prevState => ({
      tooltip: { ...prevState.tooltip, isVisible: false },
    }));
  };

  handleClick = () => {
    this.setState({ resetZoom: !this.state.resetZoom, zoomDisabled: !this.state.zoomDisabled });
  };

  handleDisableResetButton = () => {
    this.setState({ zoomDisabled: false });
  };

  render() {
    const { tooltip, data = [], resetZoom, zoomDisabled } = this.state;

    const donor = tooltip.donor;
    const tooltipStyle = {
      border: '2px solid #CCC',
      borderRadius: '10px',
      backgroundColor: '#FFF',
      position: 'absolute',
      top: tooltip.y - 32,
      left: tooltip.x - 50,
      padding: '4px',
      display: tooltip.isVisible ? 'block' : 'none',
      pointerEvents: 'none',
      fontSize: '10px',
    };

    const header = {
      display: 'flex',
      justifyContent: 'space-between',
      position: 'absolute',
      width: '92%',
    };

    const dragZoom = {
      fontSize: '10px',
      textAlign: 'right',
      color: '#888',
      marginBottom: '-10px',
      height: '13px',
    };

    return (
      <SizeProvider>
        {({ size }) => (
          <CohortCard
            Content={SurvivalCardContent}
            title={
              <div style={header}>
                <div>Overall Survival</div>
                  { !zoomDisabled && (
                    <Tooltip html={<span>Reset zoom</span>}>
                      <ResetIcon
                        css={{ marginTop: -5 }}
                        size={25}
                        color='#22AFE9'
                        onClick={this.handleClick}
                      />
                    </Tooltip> )}
                { zoomDisabled && (
                  <ResetIcon
                    css={{ marginTop: -4 }}
                    size={25}
                    color='grey'
                  />)}
              </div>
            }
            loading={this.state.isLoading}
          >
            <SurvivalChartWrapper>
              <SurvivalChartHeader>
                Applicable survival data for <a>{get(data, '[0].donors.length', 0)} Participants</a>
              </SurvivalChartHeader>
              <div style={dragZoom}>{zoomDisabled && <div>Drag to zoom</div>}</div>
              <StyledSurvivalPlot
                size={size}
                dataSets={data}
                onMouseLeaveDonors={this.handleMouseLeaveDonors}
                onMouseEnterDonors={this.handleMouseEnterDonors}
                disableResetButton={this.handleDisableResetButton}
                resetZoom={resetZoom}
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
        )}
      </SizeProvider>
    );
  }
}

export default compose(withApi)(SurvivalChart);
