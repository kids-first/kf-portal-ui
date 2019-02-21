import React, { Fragment } from 'react';
import { compose, lifecycle, withState } from 'recompose';

import { injectState } from 'freactal';
import { kfWebRoot } from 'common/injectGlobals';
import Column from 'uikit/Column';
import ExternalLink from 'uikit/ExternalLink';
import { Box } from 'uikit/Core';

import { withApi } from 'services/api';
import { withHistory } from 'services/history';
import { getFenceUser } from 'services/fence';
import { GEN3 } from 'common/constants';

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

const NoAuthorizedStudiesMessage = () => (
  <PromptMessageContainer info mb={'8px'}>
    <PromptMessageHeading info mb={10}>
      You are connected to Gen3, but you don't have access to controlled data yet.
    </PromptMessageHeading>
    <PromptMessageContent>
      Start applying for access to studies of interest from our{' '}
      <ExternalLink hasExternalIcon={false} href={`${kfWebRoot}/support/studies-and-access/`}>
        studies and access page.
      </ExternalLink>
    </PromptMessageContent>
  </PromptMessageContainer>
);

const enhance = compose(
  injectState,
  withHistory,
  withState('gen3userDetails', 'setGen3UserDetails', {}),
  withState('authorizedStudies', 'setAuthorizedStudies', []),
  withState('unauthorizedStudies', 'setUnauthorizedStudies', []),
  withState('loading', 'setLoading', false),
  withApi,
  lifecycle({
    async componentDidMount() {
      const {
        api,
        setAuthorizedStudies,
        setLoading,
        setUnauthorizedStudies,
        setGen3UserDetails,
        setBadge,
        setConnected,
      } = this.props;
      setConnected(true);
      setLoading(true);

      const [{ acceptedStudiesAggs, unacceptedStudiesAggs }, gen3User] = await Promise.all([
        getUserStudyPermission(api)({}),
        getFenceUser(api, GEN3),
      ]);

      setAuthorizedStudies(acceptedStudiesAggs);
      setUnauthorizedStudies(unacceptedStudiesAggs);
      setGen3UserDetails(gen3User);
      setBadge(acceptedStudiesAggs.length || null);
      setLoading(false);
    },
  }),
);

const Gen3Connected = ({
  history,
  authorizedStudies = [],
  unauthorizedStudies = [],
  gen3userDetails,
  loading,
}) => {
  const userConsentCodes = Object.keys(gen3userDetails.projects || {});

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

  return (
    <Fragment>
      {loading ? (
        <CardContentSpinner />
      ) : (
        <Column>
          {authorizedStudies && authorizedStudies.length > 0 ? (
            authorizedStudies.map(({ studyShortName, id: studyId }) => {
              const { authorizedFiles, unAuthorizedFiles, consentCodes } = combinedStudyData[
                studyId
              ];
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
            })
          ) : (
            <Box mt={20}>
              <Column>
                <NoAuthorizedStudiesMessage />
                <Info
                  link={{
                    url: `${kfWebRoot}/support/studies-and-access/#applying-for-data-access`,
                    text: 'applying for data access.',
                  }}
                />
              </Column>{' '}
            </Box>
          )}
        </Column>
      )}
    </Fragment>
  );
};

export default enhance(Gen3Connected);
