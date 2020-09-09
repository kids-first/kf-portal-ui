import React from 'react';

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

const TableErrorView = ({ error }) => {
  if (!error) {
    error = { message: 'Unhandled Exception' };
  }
  const message = devDebug ? (
    <React.Fragment>
      <p>{error.message}</p>
      {error.stack
        ? error.stack
            .split('\n')
            .map((line, i) => <p key={i}>{`\u00A0\u00A0\u00A0\u00A0${line}`}</p>)
        : null}
    </React.Fragment>
  ) : (
    <StandardErrorContent />
  );

  return (
    <PromptMessage
      heading={devDebug ? error.name : 'Oops, something went wrong.'}
      content={message}
      error={true}
    />
  );
};

export default TableErrorView;
