import * as React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';

const enhance = compose(injectState);

const FileRepo = ({ state, effects }) => {
  return (
    <div>
      <h2>File Repository</h2>
      <pre>
        {state.loggedInUser && (
          <div>
            Seeing files as {state.loggedInUser.firstName} {state.loggedInUser.lastName} a{' '}
            {state.loggedInUser.roles}
          </div>
        )}
      </pre>
      {!state.loggedInUser && <div>Seeing files as annon</div>}
    </div>
  );
};

export default enhance(FileRepo);
