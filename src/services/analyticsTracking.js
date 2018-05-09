import React, { Component } from 'react';
import ReactGA from 'react-ga';
import { addInfo as addUserSnapInfo } from './usersnap';
import { gaTrackingID } from 'common/injectGlobals';
import { merge } from 'lodash';

const debug = process.env.NODE_ENV === 'development';

let GAState = {
    trackingId: 'UA-87708930-5',
    userId: null,
    userRoles: null,
    clientId: null,
};
let timingsStorage = window.localStorage;

export const initAnalyticsTracking = () => {
    ReactGA.initialize(GAState.trackingId, { debug });
    ReactGA.ga(function(tracker) {
        var clientId = tracker.get('clientId');
        addStateInfo({ clientId });
        addUserSnapInfo({ gaClientId: clientId });
        ReactGA.set({ clientId: GAState.clientId });
    });
};

let setUserDimensions = (userId, role) => {
    ReactGA.set({ clientId: GAState.clientId });
    if (userId || GAState.userId) {
        ReactGA.set({ userId: userId || GAState.userId });
    }
    if (role || GAState.userRoles) {
        ReactGA.set({ userRole: role || GAState.userRoles[0] });
    }
};

export const addStateInfo = obj => merge(GAState, obj);

export const getUserAnalyticsState = () => GAState;

export const trackUserSession = async ({ egoId, _id, acceptedTerms, roles }) => {
    let userId = egoId;
    if (acceptedTerms && !GAState.userId) {
        addStateInfo({ userId, personaId: _id, userRoles: roles });
        setUserDimensions(userId, roles[0]);
        return true;
    } else {
        return false;
    }
};

export const trackUserInteraction = async eventData => {
    const { category, action, label } = eventData;
    setUserDimensions();
    ReactGA.event(eventData);
    switch (category) {
        case 'Modals':
            if (action === 'Open') {
                startAnalyticsTiming(`MODAL__${label}`);
            } else if (action === 'Close') {
                stopAnalyticsTiming(`MODAL__${label}`, {
                    category,
                    variable: 'open duration',
                    label: label || null,
                });
            }

            break;
        case 'Join':
            if (action === 'Join Completed!') {
                stopAnalyticsTiming('join process', {
                    category,
                    variable: 'Join process completion time',
                    label: label || null,
                });
            }
            break;
        default:
            break;
    }
};

let sanitizeName = name => name.toUpperCase().replace(/\s/g, '_');
let getTimingEventName = name => `KF_GA_TIMING_INIT_${sanitizeName(name)}`;

export const startAnalyticsTiming = eventName => {
    timingsStorage.setItem(getTimingEventName(eventName), +new Date());
};

export const stopAnalyticsTiming = (eventName, eventData) => {
    const event = getTimingEventName(eventName);
    const startEventTime = timingsStorage.getItem(event);
    let duration = null;

    if (startEventTime) {
        duration = +new Date() - startEventTime;
        timingsStorage.setItem(`KF_GA_TIMING_${sanitizeName(eventName)}`, duration);
    }

    if (eventData && duration) {
        trackTiming(merge({ value: duration }, eventData));
    }

    return duration;
};

export const trackTiming = async eventData => {
    setUserDimensions();
    ReactGA.timing(
        merge(
            {
                category: null,
                variable: null,
                value: 0, // in milliseconds
                label: null,
            },
            eventData,
        ),
    );
};

export const trackPageView = (page, options = {}) => {
    setUserDimensions();
    ReactGA.set({
        page,
        ...options,
    });
    ReactGA.pageview(page);
};

export const trackExternalLink = url => {
    ReactGA.outboundLink({ label: url },() => {} );
}

export function withPageViewTracker(WrappedComponent, options = {}) {
    const HOC = class extends Component {
        componentDidMount() {
            const { pathname, hash, search } = this.props.location;
            trackPageView(pathname + hash + search);
        }

        componentWillReceiveProps(nextProps) {
            const currentPage = this.props.location.pathname;
            const nextPage = nextProps.location.pathname;

            if (currentPage !== nextPage) {
                const { pathname, hash, search } = this.props.location;
                trackPageView(pathname + hash + search);
            }
        }

        render() {
            return <WrappedComponent {...this.props} />;
        }
    };

    return HOC;
}
