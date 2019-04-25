import React, { Fragment } from 'react';
import { compose } from 'recompose';
import styled from 'react-emotion';

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

import _ from 'lodash';

const InternalLink = styled(Link)`
  color: ${({ theme }) => theme.primary};
`;

const NoAuthorizedStudiesMessage = ({ user }) => (
  <PromptMessageContainer info mb={'8px'}>
    <PromptMessageHeading info mb={10}>
      You are connected to a data repository partner, but you don't have access to controlled data
      yet.
    </PromptMessageHeading>
    <PromptMessageContent>
      Start applying from our{' '}
      <InternalLink
        to={{
          pathname: `/user/${user.egoId}`,
          hash: '#settings',
        }}
      >
        studies and access page.
      </InternalLink>
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

const renderAuthorizedStudies = ({
  fenceAuthFiles,
  fenceNonAuthFiles,

  fenceAuthStudies,
  fenceNonAuthStudies,
  fenceConnections,
  history,
}) => {
  const userConsentCodes = Object.keys(fenceConnections).reduce(
    (output, key) => output.concat(Object.keys(fenceConnections[key].projects || {})),
    [],
  );

  const authStudies = _(fenceAuthFiles)
    .groupBy('studyId')
    .value();
  const unauthedStudies = _(fenceNonAuthFiles)
    .groupBy('studyId')
    .value();

  const combinedStudyData = fenceAuthStudies.reduce((acc, authorizedStudy) => {
    const unAuthorizedFiles = (
      fenceNonAuthStudies.find(({ id }) => id === authorizedStudy.id) || { files: [] }
    ).files;
    return {
      ...acc,
      [authorizedStudy.id]: {
        authorizedFiles: authorizedStudy.files,
        unAuthorizedFiles: unAuthorizedFiles,
        consentCodes: userConsentCodes.filter(code => code.includes(authorizedStudy.id)),
      },
    };
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
    const { consentCodes } = combinedStudyData[studyId];
    history.push(
      `/search/file?sqon=${encodeURI(
        JSON.stringify(createAcceptedFilesByUserStudySqon(consentCodes)({ studyId })),
      )}`,
    );
  };

  return fenceAuthStudies.map(({ studyShortName, id: studyId }) => {
    const { consentCodes } = combinedStudyData[studyId];
    const authorizedFiles = _.get(authStudies, studyId, []);
    const unauthorizedFiles = _.get(unauthedStudies, studyId, []);
    return (
      <Study
        key={studyId}
        studyId={studyId}
        name={studyShortName}
        consentCodes={consentCodes}
        authorized={authorizedFiles.length}
        total={authorizedFiles.length + unauthorizedFiles.length}
        onStudyTotalClick={onStudyTotalClick(studyId)}
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
  ({
    state: {
      loggedInUser,
      fenceConnections,
      fenceAuthStudies,
      fenceNonAuthStudies,
      fenceAuthFiles,
      fenceNonAuthFiles,
    },
    history,
  }) => {
    return (
      <Fragment>
        <Column>
          {!_.isEmpty(fenceAuthStudies) > 0
            ? renderAuthorizedStudies({
                fenceAuthFiles,
                fenceNonAuthFiles,

                fenceAuthStudies,
                fenceNonAuthStudies,
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
