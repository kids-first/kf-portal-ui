import * as React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';

import Arranger, {
  Aggregations,
  CurrentSQON,
  Table,
  DetectNewVersion,
} from '@arranger/components/dist/Arranger';
import '@arranger/components/public/themeStyles/beagle/beagle.css';

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
      <Arranger
        index="file"
        projectId="jan31"
        render={props => {
          return (
            <div>
              <DetectNewVersion {...props} />
              <div style={{ display: 'flex' }}>
                <Aggregations {...props} />
                <div
                  style={{
                    position: 'relative',
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CurrentSQON {...props} />
                  <Table {...props} />
                </div>
                <div style={{ width: 100, flex: 'none' }}>sidebar</div>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
};

export default enhance(FileRepo);
