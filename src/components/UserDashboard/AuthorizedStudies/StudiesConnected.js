import React, { Fragment } from 'react';
import { compose } from 'recompose';

import { injectState } from 'freactal';
import { kfWebRoot } from 'common/injectGlobals';
import Column from 'uikit/Column';
import { Box, Link } from 'uikit/Core';

import { withApi } from 'services/api';
import { withHistory } from 'services/history';

import { PromptMessageContainer, PromptMessageHeading, PromptMessageContent } from '../styles';
import Info from '../Info';
import { createStudyIdSqon, createAcceptedFilesByUserStudySqon } from 'services/fileAccessControl';
import Study from './Study';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';

import isEmpty from 'lodash/isEmpty';

const NoAuthorizedStudiesMessage = ({ user }) => (
  <PromptMessageContainer info mb={'8px'}>
    <PromptMessageHeading info mb={10}>
      You are connected to a data repository partner, but you don't have access to controlled data
      yet.
    </PromptMessageHeading>
    <PromptMessageContent>
      Start applying from our{' '}
      <Link
        className="color-primary"
        to={{
          pathname: `/user/${user._id}`,
          hash: '#settings',
        }}
      >
        studies and access page.
      </Link>
    </PromptMessageContent>
  </PromptMessageContainer>
);

const renderNoAuthorizedStudies = ({ loggedInUser }) => (
  <Box mt={20}>
    <Column>
      <NoAuthorizedStudiesMessage user={loggedInUser} />
      <Info
        link={{
          url: `${kfWebRoot}/support/studies-and-access/#applying-for-data-access`,
          text: 'applying for data access.',
        }}
      />
    </Column>{' '}
  </Box>
);

const renderAuthorizedStudies = ({ fenceAuthStudies, fenceConnections, history }) => {
  const studiesById = fenceAuthStudies.reduce((obj, study) => {
    obj[study.id] = study;
    return obj;
  }, {});
  const onStudyTotalClick = studyId => () => {
    trackUserInteraction({
      category: TRACKING_EVENTS.categories.user.dashboard.widgets.authorizedStudies,
      action: `Studies Total: ${TRACKING_EVENTS.actions.click}`,
      label: `studyId: ${studyId}`,
    });
    history.push(`/search/file?sqon=${encodeURI(JSON.stringify(createStudyIdSqon(studyId)))}`);
  };

  const onStudyAuthorizedClick = (studyId, eventOrigin) => {
    trackUserInteraction({
      category: TRACKING_EVENTS.categories.user.dashboard.widgets.authorizedStudies,
      action: `${eventOrigin}: ${TRACKING_EVENTS.actions.click}`,
      label: `studyId: ${studyId}`,
    });
    const consentCodes = studiesById[studyId].acl;
    history.push(
      `/search/file?sqon=${encodeURI(
        JSON.stringify(createAcceptedFilesByUserStudySqon(consentCodes)({ studyId })),
      )}`,
    );
  };

  return fenceAuthStudies.map(study => {
    return (
      <Study
        key={study.id}
        studyId={study.id}
        name={study.studyShortName}
        consentCodes={study.acl}
        authorized={study.authorizedFiles}
        total={study.totalFiles}
        onStudyTotalClick={onStudyTotalClick(study.id)}
        onStudyAuthorizedClick={onStudyAuthorizedClick}
      />
    );
  });
};

const enhance = compose(
  injectState,
  withHistory,
  withApi,
);

const StudiesConnected = enhance(
  ({ state: { loggedInUser, fenceConnections, fenceAuthStudies }, history }) => {
    return (
      <Fragment>
        <Column>
          {!isEmpty(fenceAuthStudies) > 0
            ? renderAuthorizedStudies({
                fenceAuthStudies,
                fenceConnections,
                history,
              })
            : renderNoAuthorizedStudies({ loggedInUser })}
        </Column>
      </Fragment>
    );
  },
);

export default StudiesConnected;
