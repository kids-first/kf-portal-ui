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
  return lines.map((line, i) => <p key={`error_line_${i}`}>{`${indentation}${line}`}</p>);
};

const GenericErrorDisplay = ({ error }) => {
  let message = '';
  let header = '';

  if (!devDebug) {
    header = 'Oops, something went wrong.';
    message = <StandardErrorContent />;
  } else if (typeof error === 'string') {
    message = <React.Fragment>{splitMessageOnLines(error)}</React.Fragment>;
  } else {
    message = <React.Fragment>{splitMessageOnLines(error.stack || error.message)}</React.Fragment>;
  }

  return <PromptMessage heading={header} content={message} error={true} />;
};

const messageValidator = PropTypes.oneOf([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]);
GenericErrorDisplay.propTypes = {
  error: PropTypes.oneOf([
    PropTypes.string,
    PropTypes.shape({
      message: messageValidator,
      stack: messageValidator,
    }),
  ]),
};

export default GenericErrorDisplay;
