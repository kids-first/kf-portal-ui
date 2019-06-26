import React from 'react';
import PropTypes from 'prop-types';

import { kfWebRoot, devDebug } from 'common/injectGlobals';
import PromptMessage from 'uikit/PromptMessage';
import ExternalLink from 'uikit/ExternalLink';

const StandardErrorContent = () => (
  <div>
    {`Try refreshing the page and if the error persists, `}
    <ExternalLink href={`${kfWebRoot}/contact/`} hasExternalIcon={false}>
      contact us
    </ExternalLink>
  </div>
);

const splitMessageOnLines = (message, indent = 0) => {
  const indentation = new Array(indent).join('\u00A0');
  const lines = Array.isArray(message)
    ? message
    : typeof message === 'string'
    ? message.split(/\n/)
    : [];
  return lines.map((line, i) => (
    <React.Fragment>
      <span key={`error_line_${i}`}>{`${indentation}${line}`}</span>
      <br />
    </React.Fragment>
  ));
};

const GenericErrorDisplay = ({ error, footer = null, header = 'Oops, something went wrong.' }) => {
  let message = '';

  if (!devDebug) {
    message = <StandardErrorContent />;
  } else if (typeof error === 'string') {
    message = <React.Fragment>{splitMessageOnLines(error)}</React.Fragment>;
  } else if (typeof error === 'object') {
    message = <React.Fragment>{splitMessageOnLines(error.stack || error.message)}</React.Fragment>;
  }

  if (footer) {
    message = (
      <React.Fragment>
        {message}
        <br />
        {footer}
      </React.Fragment>
    );
  }

  return (
    <PromptMessage
      className="generic-error-display"
      heading={header}
      content={message}
      error={true}
    />
  );
};

const messageValidator = PropTypes.oneOf([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]);
GenericErrorDisplay.propTypes = {
  header: PropTypes.string,
  error: PropTypes.oneOf([
    PropTypes.string,
    PropTypes.shape({
      message: messageValidator,
      stack: messageValidator,
    }),
  ]),
  link: PropTypes.shape({
    label: PropTypes.string,
    href: PropTypes.string.isRequired,
  }),
};

export default GenericErrorDisplay;
