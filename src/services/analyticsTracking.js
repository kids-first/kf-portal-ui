import {Component} from 'react';
import ReactGA from 'react-ga';
import { withRouter } from 'react-router-dom';

let GA_TRACKERS = [];

export const initAnalyticsTracking =  async (trackers) => {
    GA_TRACKERS = trackers;
    await ReactGA.initialize(trackers, { debug: true, alwaysSendToDefaultTracker: false });
}


class GoogleAnalytics extends Component {
    componentWillUpdate ({ location, history }) {
        const gtag = window.gtag;
        
        if (location.search === this.props.location.search &&
            location.hash === this.props.location.hash) {
            // don't log identical link clicks (nav links likely)
            return;
        }

        if (history.action === 'PUSH' &&
            typeof(gtag) === 'function') {
            ReactGA.pageview(window.location.href, GA_TRACKERS, document.title);
        }
    }

    render () {
        return null;
    }
}

export const PageViewTracker = withRouter(GoogleAnalytics);

