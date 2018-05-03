import { Component } from 'react';
import ReactGA from 'react-ga';
import { withRouter } from 'react-router-dom';
// import { gaTrackingID } from 'common/injectGlobals';
import { merge } from 'lodash';

const debug = process.env.NODE_ENV === 'development';

let GAState = {
    trackers: [
        {
            trackingId: 'UA-87708930-5',//gaTrackingID,
            debug,
            gaOptions: {
                name: 'Kids_First_Deploy_Preview_336',
            },
        },
         {
            trackingId: 'UA-87708930-3',//gaTrackingID,
            debug,
            gaOptions: {
                name: 'Kids_First_Beta',
            },
        },
    ],
    userId: null,
};

let modalTimings = {};

export const addStateInfo = obj => merge(GAState, obj);

export const initAnalyticsTracking = trackers =>
    ReactGA.initialize(GAState.trackers, { debug, alwaysSendToDefaultTracker: true });

export const trackUserSession = async ({ _id, acceptedTerms }) => {
    let userId = _id;
    if (acceptedTerms && !GAState.userId) {
        await ReactGA.set({ userId });
        addStateInfo({ userId });
        return true;
    } else {
        return false;
    }
};

export const trackUserInteraction = async eventData => {
    ReactGA.event(eventData);

    switch (eventData.category) {
        case 'Modals':
            if (eventData.action === 'Open') {
                modalTimings[eventData.label] = {
                    open: +new Date(),
                    close: null,
                    duration: 0,
                };
            } else if (eventData.action === 'Close') {
                let modal = modalTimings[eventData.label];
                modal.close = +new Date();
                modal.duration = modal.close - modal.open;
                trackTiming({
                    category: 'Modals',
                    variable: 'open duration',
                    value: modal.duration, // in milliseconds
                    label: eventData.label,
                });
        }
            break;
        default:
            break;
    }
};

export const trackTiming = async eventData => ReactGA.timing(eventData);

class GoogleAnalytics extends Component {
    componentWillUpdate({ location, history }) {
        const gtag = window.gtag;

        if (
            location.search === this.props.location.search &&
            location.hash === this.props.location.hash
        ) {
            // don't log identical link clicks (nav links likely)
            return;
        }

        if (history.action === 'PUSH' && typeof gtag === 'function') {
            ReactGA.pageview(window.location.href, GAState.trackers, document.title);
        }
    }

    render() {
        return null;
    }
}

export const PageViewTracker = withRouter(GoogleAnalytics);
