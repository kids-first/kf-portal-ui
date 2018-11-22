import React from 'react';
import { compose, lifecycle, withState } from 'recompose';

import { injectState } from 'freactal';

import Column from 'uikit/Column';
import ExternalLink from 'uikit/ExternalLink';

import {
  PromptMessageContainer,
  PromptMessageHeading,
  PromptMessageContent,
} from 'uikit/PromptMessage';
import { withApi } from 'services/api';
import { withHistory } from 'services/history';
import { getUser as getGen3User } from 'services/gen3';

import Info from '../Info';
import {
  getUserStudyPermission,
  createStudyIdSqon,
  createAcceptedFilesByUserStudySqon,
} from 'services/fileAccessControl';
import Study from './Study';
import { CardContentSpinner } from '../styles';

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
      } = this.props;
      setLoading(true);

      const [{ acceptedStudiesAggs, unacceptedStudiesAggs }, gen3User] = await Promise.all([
        getUserStudyPermission(api)({}),
        getGen3User(api),
      ]);

      setAuthorizedStudies(acceptedStudiesAggs);
      setUnauthorizedStudies(unacceptedStudiesAggs);
      setGen3UserDetails(gen3User);
      setLoading(false);
    },
  }),
);

const Gen3Connected = ({
  history,
  authorizedStudies = [],
  unauthorizedStudies = [],
  setBadge,
  gen3userDetails,
  loading,
}) => {
  setBadge(authorizedStudies.length || null);

  const combinedStudyData = authorizedStudies.reduce((acc, authorizedStudy) => {
    const unAuthorizedFiles = (
      unauthorizedStudies.find(({ id }) => id === authorizedStudy.id) || { files: [] }
    ).files;
    return {
      ...acc,
      [authorizedStudy.id]: {
        authorizedFiles: authorizedStudy.files,
        unAuthorizedFiles: unAuthorizedFiles,
      },
    };
  }, {});

  const onStudyTotalClick = studyId => () => {
    history.push(`/search/file?sqon=${encodeURI(JSON.stringify(createStudyIdSqon(studyId)))}`);
  };

  const onStudyAuthorizedClick = studyId => () => {
    history.push(
      `/search/file?sqon=${encodeURI(
        JSON.stringify(createAcceptedFilesByUserStudySqon(gen3userDetails)({ studyId })),
      )}`,
    );
  };

  return (
    <React.Fragment>
      {loading ? (
        <CardContentSpinner />
      ) : (
        <Column>
          {authorizedStudies ? (
            authorizedStudies.map(({ studyShortName, id: studyId }) => {
              const { authorizedFiles, unAuthorizedFiles } = combinedStudyData[studyId];
              return (
                <Study
                  key={studyId}
                  studyId={studyId}
                  name={studyShortName}
                  codes={''}
                  authorized={authorizedFiles.length}
                  total={authorizedFiles.length + unAuthorizedFiles.length}
                  onStudyTotalClick={onStudyTotalClick(studyId)}
                  onStudyAuthorizedClick={onStudyAuthorizedClick(studyId)}
                />
              );
            })
          ) : (
            <Column>
              <PromptMessageContainer mb={0} width={'100%'}>
                <PromptMessageHeading mb={10}>
                  You are connected to Gen3, but you don’t have access to controlled data yet.
                </PromptMessageHeading>
                <PromptMessageContent>
                  Start applying for access to studies of interest from our{' '}
                  <ExternalLink
                    href={'https://kidsfirstdrc.org/support/studies-and-access/'}
                    hasExternalIcon={false}
                  >
                    studies and access page
                  </ExternalLink>
                </PromptMessageContent>
              </PromptMessageContainer>
              <Info
                link={{
                  url:
                    'https://kidsfirstdrc.org/support/studies-and-access/#applying-for-data-access',
                  text: 'applying for data access.',
                }}
              />
            </Column>
          )}
        </Column>
      )}
    </React.Fragment>
  );
};

export default enhance(Gen3Connected);
