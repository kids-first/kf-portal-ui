import React from 'react';
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
import { studiesList } from '../UserDashboard.module.css';
import PropTypes from 'prop-types';

const NoAuthorizedStudiesMessage = ({ user }) => (
  <PromptMessageContainer info mb={'8px'}>
    <PromptMessageHeading mb={10}>
      {"   You are connected to a data repository partner, but you don't have access to controlled data\n" +
        '      yet.'}
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

NoAuthorizedStudiesMessage.propTypes = {
  user: PropTypes.object.isRequired,
};

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

renderNoAuthorizedStudies.propTypes = {
  loggedInUser: PropTypes.object.isRequired,
};

const renderAuthorizedStudies = ({ fenceAuthStudies, history }) => {
  const studiesById = fenceAuthStudies.reduce((obj, study) => {
    obj[study.id] = study;
    return obj;
  }, {});
  const onStudyTotalClick = (studyId) => () => {
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

  return fenceAuthStudies.map((study) => (
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
  ));
};

renderAuthorizedStudies.propTypes = {
  fenceAuthStudies: PropTypes.array.isRequired,
  history: PropTypes.array.isRequired,
};

const enhance = compose(injectState, withHistory, withApi);

const StudiesConnected = enhance(
  ({ state: { loggedInUser, fenceConnections, fenceAuthStudies }, history }) => {
    const hasAuthorizedStudies = fenceAuthStudies && fenceAuthStudies.length > 0;
    if (hasAuthorizedStudies) {
      return (
        <Column scrollY className={studiesList}>
          {renderAuthorizedStudies({
            fenceAuthStudies,
            fenceConnections,
            history,
          })}
        </Column>
      );
    }

    return <Column>{renderNoAuthorizedStudies({ loggedInUser })}</Column>;
  },
);

export default StudiesConnected;
