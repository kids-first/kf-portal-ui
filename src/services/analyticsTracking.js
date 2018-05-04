import React, { Component } from 'react';
import ReactGA from 'react-ga';
import { gaTrackingID } from 'common/injectGlobals';
import { merge } from 'lodash';

const debug = process.env.NODE_ENV === 'development';

let GAState = {
    trackingId: gaTrackingID,
    userId: null,
};

let modalTimings = {};

export const addStateInfo = obj => merge(GAState, obj);

export const initAnalyticsTracking = () => ReactGA.initialize(GAState.trackingId, { debug });

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


export function withPageViewTracker(WrappedComponent, options = {}) {
    const trackPage = page => {
        ReactGA.set({
            page,
            ...options,
        });
        ReactGA.pageview(page);
    };

    const HOC = class extends Component {
        componentDidMount() {
            const {pathname, hash, search} = this.props.location;
            trackPage(pathname + hash + search);
        }

        componentWillReceiveProps(nextProps) {
            const currentPage = this.props.location.pathname;
            const nextPage = nextProps.location.pathname;

            if (currentPage !== nextPage) {
                const {pathname, hash, search} = this.props.location;
                trackPage(pathname + hash + search);
            }
        }

        render() {
            return <WrappedComponent {...this.props} />;
        }
    };

    return HOC;
}
