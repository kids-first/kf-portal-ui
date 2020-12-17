import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { renderPlot } from '@oncojs/survivalplot';
import defaults from 'lodash/defaults';

const isElementFullScreen = (element) =>
  [
    document.fullscreenElement,
    document.webkitFullscreenElement,
    document.mozFullscreenElement,
  ].indexOf(element) >= 0;

export default class SurvivalPlot extends React.Component {
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
    onMouseEnterDonors: PropTypes.func,
    onMouseLeaveDonors: PropTypes.func,
    height: PropTypes.number,
  };

  static defaultProps = {
    className: '',
    palette: ['#1880b2', '#c20127', '#00005d', 'purple'],
    censoredStatuses: ['alive'],
    onMouseEnterDonors: () => {},
    onMouseLeaveDonors: () => {},
    disableResetButton: () => {},
    onClickDonors: () => {},
    xAxisLabel: 'Survival Rate',
    yAxisLabel: 'Duration (days)',
    height: 205,
  };

  stateStack = [];

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
  }

  componentDidUpdate(prevProps) {
    const isZoomReset = prevProps.resetZoom !== this.props.resetZoom;
    if (isZoomReset) {
      this.setState({ xDomain: undefined });
    }
    this.update();
  }

  componentDidMount() {
    this.update();
  }

  updateState = (newState) => {
    this.stateStack = this.stateStack.concat(this.state);
    this.setState(newState);
  };

  update = (params) => {
    const { disabledDataSets, xDomain } = this.state;
    const container = this._container;
    renderPlot(
      defaults(
        {
          container,
          dataSets: this.props.dataSets,
          disabledDataSets: disabledDataSets,
          palette: this.props.palette,
          xDomain: xDomain,
          yAxisLabel: 'Survival Rate',
          xAxisLabel: 'Duration (days)',
          height: isElementFullScreen(container) ? window.innerHeight - 100 : 330,
          getSetSymbol: this.props.getSetSymbol,
          onMouseEnterDonor: this.props.onMouseEnterDonor,
          onMouseLeaveDonor: this.props.onMouseLeaveDonor,
          onClickDonor: this.props.onClickDonor,
          onMouseEnterDonors: this.props.onMouseEnterDonors,
          onMouseLeaveDonors: this.props.onMouseLeaveDonors,
          onClickDonors: this.props.onClickDonors,
          onDomainChange: (newXDomain) => {
            this.props.disableResetButton();
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
    return <div ref={(c) => (this._container = c)} className={this.props.className} />;
  }
}
