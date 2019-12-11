import React, { Fragment } from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import get from 'lodash/get';

import LoadingSpinner from 'uikit/LoadingSpinner';
import Row from 'uikit/Row';
import Column from 'uikit/Column';
import ExternalLink from 'uikit/ExternalLink';
import { Span } from 'uikit/Core';
import { PromptMessageContainer } from 'uikit/PromptMessage';
import RightChevron from 'icons/DoubleChevronRightIcon';
import StackIcon from 'icons/StackIcon';
import { withHistory } from 'services/history';
import { fenceConnectionInitializeHoc } from 'stateProviders/provideFenceConnections';

import './FenceAuthorizedStudies.css';

const Spinner = () => (
  <Row justifyContent={'center'}>
    <LoadingSpinner width={20} height={20} />
  </Row>
);

const sqonForStudy = studyId => ({
  op: 'and',
  content: [
    {
      op: 'in',
      content: {
        field: 'participants.study.external_id',
        value: [studyId],
      },
    },
  ],
});

const FenceProjectList = compose(
  withHistory,
  injectState,
  fenceConnectionInitializeHoc,
)(({ fence, history, state: { fenceStudies, fenceConnectionsInitialized } }) =>
  !fenceConnectionsInitialized ? (
    <Spinner />
  ) : (
    get(fenceStudies, `${fence}.authorizedStudies`, []).map(({ id, studyShortName }) => {
      const sqon = sqonForStudy(id);
      return (
        <Row className="itemRowContainer" key={id}>
          <Column justifyContent="center" p={15}>
            <StackIcon width={20} />
          </Column>
          <Column flex={1} justifyContent="center" pr={10}>
            <Span>
              <strong>{studyShortName}</strong> ({`${id}`})
            </Span>
          </Column>
          <Column justifyContent="center">
            <ExternalLink hasExternalIcon={false}>
              <Span
                onClick={() => history.push(`/search/file?sqon=${encodeURI(JSON.stringify(sqon))}`)}
              >
                {'View data files'} <RightChevron width={10} fill={'#90278e'} />
              </Span>
            </ExternalLink>
          </Column>
        </Row>
      );
    })
  ),
);

const FenceAuthorizedStudies = ({ fence, fenceUser }) => {
  return (
    <div className="fenceAuthorizedStudies-container">
      <Column>
        {fenceUser && fenceUser.projects && Object.keys(fenceUser.projects).length ? (
          <Fragment>
            <Row style={{ margin: '10px 0' }}>
              <Span className="title" fontWeight={'bold'}>
                {' '}
                You have access to controlled datasets from the following studies:
              </Span>
            </Row>
            <Column pl={15}>
              <FenceProjectList fence={fence} />
            </Column>
          </Fragment>
        ) : (
          <Row>
            <PromptMessageContainer warning mb={0} width={'100%'}>
              <Span className="title" fontWeight={'bold'}>
                {'You do not have access to any studies.'}
              </Span>
            </PromptMessageContainer>
          </Row>
        )}
      </Column>
    </div>
  );
};

export default FenceAuthorizedStudies;
