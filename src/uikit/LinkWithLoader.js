import React from 'react';
import Component from 'react-component-component';
import { withRouter } from 'react-router-dom';
import LoadingSpinner from 'uikit/LoadingSpinner';
import PropTypes from 'prop-types';
import { Link } from './Core';
/**
 * Purpose is to create a link and navigate to it when you need it async
 * eg. dynamically generating a link that takes time because of requesting data
 */
const LinkWithLoader = ({ getLink, children, history, className, onClick, replaceText = true }) => (
  <Component initialState={{ isLoading: false }}>
    {({ state, setState }) => (
      <React.Fragment>
        <Link
          className={className}
          to=""
          onClick={async e => {
            e.preventDefault();
            setState({ isLoading: true });
            if (onClick) { onClick(); }
            const url = await getLink();
            history.push(url);
          }}
        >
          {state.isLoading && replaceText ? (
            <LoadingSpinner size="11px" center={false} />
          ) : (
              children
            )}
        </Link>
        {state.isLoading && !replaceText ? <LoadingSpinner size="11px" center={false} /> : null}
      </React.Fragment>
    )}
  </Component>
);

LinkWithLoader.propTypes = {
  getLink: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(LinkWithLoader);
