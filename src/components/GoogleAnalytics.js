import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';

class GoogleAnalytics extends Component {
    componentWillUpdate ({ location, history }) {
        const gtag = window.gtag;
        
        if (location.search === this.props.location.search) {
            // don't log identical link clicks (nav links likely)
            return;
        }

        if (history.action === 'PUSH' &&
            typeof(gtag) === 'function') {
            
            gtag('config', process.env.REACT_APP_GA_TRACKING_ID, {
                'page_title': document.title,
                'page_location': window.location.href,
                'page_path': location.pathname
            });
        }
    }

    render () {
        return null;
    }
}

export default withRouter(GoogleAnalytics);