import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
import has from 'lodash/has';
import md5 from 'md5';
import { compose } from 'recompose';
import ResetIcon from 'react-icons/lib/md/replay';
import { fetchSurvivalData } from 'services/arranger';
import { withApi } from 'services/api';
import CardContent from 'uikit/Card/CardContent';
import Tooltip from 'uikit/Tooltip';
import { styleComponent } from 'components/Utils';
import theme from 'theme/defaultTheme';
import SurvivalPlot from './SurvivalPlot';
import Card from '@ferlab/ui/core/view/GridCard';

import './SurvivalChart.css';
import Empty, { SIZE } from 'components/UI/Empty';

const formatDataset = (data) => [
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

const SurvivalCardContent = styleComponent(CardContent, 'survivalChart-card-content');

export class SurvivalChart extends React.Component {
  state = {
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

  static propTypes = {
    api: PropTypes.func.isRequired,
    sqon: PropTypes.object.isRequired,
  };

  queryCacheMap = {};

  cachedFetch = () => {
    const { api, sqon } = this.props;
    const hash = md5(JSON.stringify(sqon));
    return new Promise((resolve, reject) => {
      if (has(this.queryCacheMap, hash)) {
        resolve(this.queryCacheMap[hash]);
      } else {
        fetchSurvivalData(api)(sqon)
          .then((data) => {
            const formattedData = formatDataset(data);
            this.queryCacheMap[hash] = formattedData;
            resolve(formattedData);
          })
          .catch((err) => reject(err));
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
      .then((data) => {
        if (this.fetchCount === checkCount) {
          this.setState({ data, isLoading: false });
        }
      })
      .catch((err) => {
        console.error(`Error fetching survival data: ${err}`);
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
    this.setState((prevState) => ({
      tooltip: {
        ...prevState.tooltip,
        isVisible: true,
        donor: donors[0],
        x: event.offsetX,
        y: event.offsetY,
      },
    }));
  };

  handleMouseLeaveDonors = () => {
    this.setState((prevState) => ({
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

    if (data.length === 0) {
      return (
        <Card
          title={<span className={'title-summary-card'}>Overall Survival</span>}
          loading={this.state.isLoading}
        >
          <div className={'empty-graph'}>
            <Empty size={SIZE.SMALL} />
          </div>
        </Card>
      );
    }

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

    const resetZoomIcon = (
      <div className={'survival-chart-reset-zoom-icon-header'}>
        {zoomDisabled ? (
          <ResetIcon size={25} color="grey" />
        ) : (
          <Tooltip html={<span>Reset zoom</span>}>
            <ResetIcon size={25} color="#22AFE9" onClick={this.handleClick} />
          </Tooltip>
        )}
      </div>
    );

    const renderGraphContent = (size, height) => (
      <>
        <div style={{ marginTop: '10px' }}>
          <div className="survivalChart-card-header">
            Applicable survival data for{' '}
            <span style={{ color: theme.chartColors.blue }}>
              {get(data, '[0].donors.length', 0)} Participants
            </span>
          </div>
          <div className={'survival-chart-drag-zoom'}>
            {zoomDisabled && <div>Drag to zoom</div>}
          </div>

          <SurvivalPlot
            className="survivalChart-styledChard"
            size={size}
            dataSets={data}
            onMouseLeaveDonors={this.handleMouseLeaveDonors}
            onMouseEnterDonors={this.handleMouseEnterDonors}
            disableResetButton={this.handleDisableResetButton}
            resetZoom={resetZoom}
            height={height}
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
        </div>
      </>
    );

    const Header = (
      <div className="survival-chart-header">
        <span className={'title-summary-card'}>Overall Survival</span>
        <span>{resetZoomIcon}</span>
      </div>
    );

    return (
      <Card title={Header} loading={this.state.isLoading}>
        <SurvivalCardContent>{renderGraphContent(330, 325)}</SurvivalCardContent>
      </Card>
    );
  }
}

export default compose(withApi)(SurvivalChart);
