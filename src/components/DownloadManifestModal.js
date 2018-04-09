import React from 'react';
import { compose, withState } from 'recompose';
import { injectState } from 'freactal/lib/inject';
import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import { Trans } from 'react-i18next';

import { ColumnsState } from '@arranger/components/dist/DataTable';

import { DownloadIcon, Spinner } from './icons';
import { ModalFooter } from './Modal';
import { FileRepoStats } from './Stats';
import LoadingOnClick from 'components/LoadingOnClick';
import { fileManifestParticipantsOnly } from '../services/downloadData';
import graphql from '../services/arranger';

const Button = compose(withTheme)(({ theme, children, ...props }) => (
  <button css={theme.actionButton} {...props}>
    <div
      className={css`
        display: flex;
        justify-content: center;
        align-items: center;
      `}
    >
      {children}
    </div>
  </button>
));

const SubHeader = ({ children, ...props }) => (
  <div
    className={css`
      margin-bottom: 9px;
      font-size: 15px;
      font-weight: 600;
      line-height: 1.87;
      letter-spacing: 0.2px;
      color: #343434;
    `}
  >
    {children}
  </div>
);

const GenerateManifestSet = compose(injectState, withState('setId', 'setSetId', ''))(
  ({ setId, setSetId, sqon = {}, state: { loggedInUser } }) => (
    <div>
      {setId ? (
        <span>{setId}</span>
      ) : (
        <LoadingOnClick
          onClick={async () => {
            const response = await graphql({
              body: {
                query: `
                  mutation saveSet($graphqlField: String! $userId: String! $sqon: JSON! $path: String!) {
                    saveSet(graphqlField: $graphqlField, userId: $userId, sqon: $sqon, path: $path) {
                      setId
                      userId
                      sqon
                      index
                      ids
                    }
                  }
                `,
                variables: {
                  sqon,
                  graphqlField: 'file',
                  userId: loggedInUser.egoId,
                  path: 'kf_id',
                },
              },
            });
            console.log(response);
          }}
          render={({ onClick, loading }) => (
            <Button onClick={onClick}>
              {loading && <Spinner />}
              <Trans>Generate KF-get ID</Trans>
            </Button>
          )}
        />
      )}
    </div>
  ),
);

const enhance = compose();

const DownloadManifestModal = ({ sqon, index, projectId }) => (
  <div>
    <SubHeader>File Summary:</SubHeader>
    <FileRepoStats
      sqon={sqon}
      index={index}
      projectId={projectId}
      css={`
        margin-bottom: 29px;
      `}
    />
    <ModalFooter showSubmit={false}>
      <GenerateManifestSet {...{ sqon, projectId }} />
      <ColumnsState
        projectId={projectId}
        graphqlField="file"
        render={({ state: { columns } }) => (
          <LoadingOnClick
            onClick={fileManifestParticipantsOnly({ sqon, columns })}
            render={({ onClick, loading }) => (
              <Button {...{ onClick }}>
                <DownloadIcon {...{ loading }} />
                <Trans>Download Manifest</Trans>
              </Button>
            )}
          />
        )}
      />
    </ModalFooter>
  </div>
);

export default enhance(DownloadManifestModal);
