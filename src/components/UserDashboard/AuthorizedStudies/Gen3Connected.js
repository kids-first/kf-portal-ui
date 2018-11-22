import React from 'react';
import { compose, lifecycle, withState } from 'recompose';

import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';

import LoadingSpinner from 'uikit/LoadingSpinner';
import Column from 'uikit/Column';
import ExternalLink from 'uikit/ExternalLink';

import {
  PromptMessageContainer,
  PromptMessageHeading,
  PromptMessageContent,
} from 'uikit/PromptMessage';
import { withApi } from 'services/api';

import Info from '../Info';
import { getUserStudyPermission } from 'services/fileAccessControl';
import Study from './Study';

const enhance = compose(
  injectState,
  withTheme,
  withState('gen3Key', 'setGen3Key', undefined),
  withState('authorizedStudies', 'setauthorizedStudies', []),
  withState('loading', 'setLoading', false),
  withApi,
  lifecycle({
    async componentDidMount() {
      const { setauthorizedStudies, api, setLoading } = this.props;
      setLoading(true);

      const { acceptedStudiesAggs: authorizedStudies } = await getUserStudyPermission(api)({});

      setLoading(false);
      setauthorizedStudies(authorizedStudies);
    },
  }),
);

const Gen3Connected = ({
  state,
  effects,
  theme,
  authorizedStudies,
  setUserDetails,
  setBadge,
  loading,
  ...props
}) => {
  setBadge(authorizedStudies ? authorizedStudies.length : null);

  const totalFileCount = authorizedStudies.reduce((acc, { files }) => [...acc, ...files], [])
    .length;

  return (
    <div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Column>
          {authorizedStudies ? (
            authorizedStudies.map(({ studyShortName, id, files }) => (
              <Study
                key={id}
                studyId={id}
                name={studyShortName}
                codes={''}
                authorized={files.length}
                total={totalFileCount}
              />
            ))
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
    </div>
  );
};

export default enhance(Gen3Connected);
