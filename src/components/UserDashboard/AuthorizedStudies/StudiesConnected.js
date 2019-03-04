import React, { Fragment } from 'react';
import { compose, lifecycle, withState } from 'recompose';
import styled from 'react-emotion';

import { injectState } from 'freactal';
import { kfWebRoot } from 'common/injectGlobals';
import Column from 'uikit/Column';
import { Box, Link } from 'uikit/Core';

import { withApi } from 'services/api';
import { withHistory } from 'services/history';
import { FENCES, GEN3, DCF } from 'common/constants';

import { PromptMessageContainer, PromptMessageHeading, PromptMessageContent } from '../styles';
import Info from '../Info';
import {
  getUserStudyPermission,
  createStudyIdSqon,
  createAcceptedFilesByUserStudySqon,
} from 'services/fileAccessControl';
import Study from './Study';
import { CardContentSpinner } from '../styles';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';

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
  authorizedStudies,
  unauthorizedStudies,
  fenceConnections,
  history,
}) => {
  console.log(fenceConnections[GEN3]);
  const userConsentCodes = Object.keys(fenceConnections).reduce(
    (output, key) => output.concat(Object.keys(fenceConnections[key].projects || {})),
    [],
  );

  const combinedStudyData = authorizedStudies.reduce((acc, authorizedStudy) => {
    const unAuthorizedFiles = (
      unauthorizedStudies.find(({ id }) => id === authorizedStudy.id) || { files: [] }
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

    history.push(
      `/search/file?sqon=${encodeURI(
        JSON.stringify(createAcceptedFilesByUserStudySqon(gen3userDetails)({ studyId })),
      )}`,
    );
  };

  return authorizedStudies.map(({ studyShortName, id: studyId }) => {
    const { authorizedFiles, unAuthorizedFiles, consentCodes } = combinedStudyData[studyId];
    return (
      <Study
        key={studyId}
        studyId={studyId}
        name={studyShortName}
        consentCodes={consentCodes}
        authorized={authorizedFiles.length}
        total={authorizedFiles.length + unAuthorizedFiles.length}
        onStudyTotalClick={onStudyTotalClick(studyId)}
        onStudyAuthorizedClick={onStudyAuthorizedClick}
      />
    );
  });
};

const enhance = compose(
  injectState,
  withHistory,
  withState('authorizedStudies', 'setAuthorizedStudies', []),
  withState('unauthorizedStudies', 'setUnauthorizedStudies', []),
  withApi,
  lifecycle({
    async componentDidMount() {
      const { api, setAuthorizedStudies, setUnauthorizedStudies, setBadge } = this.props;

      this.props.effects.fetchFenceStudies({ api }).then(() => {
        const authStudies = FENCES.reduce(
          (output, fence) =>
            this.props.state.fenceStudies[fence] &&
            _.isArray(this.props.state.fenceStudies[fence].authorizedStudies)
              ? output.concat(this.props.state.fenceStudies[fence].authorizedStudies)
              : output,
          [],
        );
        const unauthStudies = Object.keys(this.props.state.fenceStudies).reduce(
          (output, key) =>
            _.isArray(this.props.state.fenceStudies[key].unauthorizedStudies)
              ? output.concat(this.props.state.fenceStudies[key].unauthorizedStudies)
              : output,
          [],
        );
        setAuthorizedStudies(authStudies);
        setUnauthorizedStudies(unauthStudies);
        setBadge(authStudies.length);
      });
    },
  }),
);

const StudiesConnected = enhance(
  ({
    state: { loggedInUser, fetchingFenceStudies, fenceConnections, fenceStudies },
    history,
    authorizedStudies = [],
    unauthorizedStudies = [],
    loading,
  }) => {
    return (
      <Fragment>
        {fetchingFenceStudies ? (
          <CardContentSpinner />
        ) : (
          <Column>
            {authorizedStudies && authorizedStudies.length > 0
              ? renderAuthorizedStudies({
                  authorizedStudies,
                  unauthorizedStudies,
                  fenceConnections,
                  history,
                })
              : renderNoAuthorizedStudies({ loggedInUser })}
          </Column>
        )}
      </Fragment>
    );
  },
);

export default StudiesConnected;
