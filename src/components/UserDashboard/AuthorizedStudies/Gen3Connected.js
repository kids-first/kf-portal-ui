import React, { Fragment } from 'react';
import { compose, lifecycle, withState } from 'recompose';

import { getUser as getGen3User, getStudyIds } from 'services/gen3';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';

import LoadingSpinner from 'uikit/LoadingSpinner';
import Row from 'uikit/Row';
import Column from 'uikit/Column';
import ExternalLink from 'uikit/ExternalLink';
import { getStudyIdsFromSqon, getStudiesAggregationsFromSqon } from '../../cavatica/utils';

import { Span } from 'uikit/Core';
import {
  PromptMessageContainer,
  PromptMessageHeading,
  PromptMessageContent,
} from 'uikit/PromptMessage';
import { withApi } from 'services/api';

import Gen3ProjectList from './Gen3ProjectList';
import Info from '../Info';

const enhance = compose(
  injectState,
  withTheme,
  withState('gen3Key', 'setGen3Key', undefined),
  withState('userDetails', 'setUserDetails', {}),
  withState('loading', 'setLoading', false),
  withApi,
  lifecycle({
    async componentDidMount() {
      const { setUserDetails, api, setLoading } = this.props;
      setLoading(true);
      let userDetails = await getGen3User(api);

      const approvedAcls = Object.keys(userDetails.projects).sort();
      console.log('approved acls', approvedAcls);

      const sqon = this.props.sqon || {
        op: 'and',
        content: [],
      };

      const [acceptedStudyIds, unacceptedStudyIds] = await Promise.all([
        getStudyIdsFromSqon(api)({
          sqon: {
            op: 'and',
            content: [
              ...sqon.content,
              {
                op: 'in',
                content: {
                  field: 'acl',
                  value: approvedAcls,
                },
              },
            ],
          },
        }),
        getStudyIdsFromSqon(api)({
          sqon: {
            op: 'and',
            content: [
              ...sqon.content,
              {
                op: 'not',
                content: [
                  {
                    op: 'in',
                    content: {
                      field: 'acl',
                      value: approvedAcls,
                    },
                  },
                ],
              },
            ],
          },
        }),
      ]);
      console.log('accepted', acceptedStudyIds, 'unaccepted', unacceptedStudyIds);

      const [acceptedStudiesAggs, unacceptedStudiesAggs] = await Promise.all([
        getStudiesAggregationsFromSqon(api)(acceptedStudyIds)(
          acceptedStudyIds.reduce((acc, id) => {
            acc[`${id}_sqon`] = {
              op: 'and',
              content: [
                ...sqon.content,
                {
                  op: 'in',
                  content: {
                    field: 'acl',
                    value: approvedAcls,
                  },
                },
                {
                  op: 'in',
                  content: {
                    field: 'participants.study.external_id',
                    value: [id],
                  },
                },
              ],
            };
            return acc;
          }, {}),
        ),
        getStudiesAggregationsFromSqon(api)(unacceptedStudyIds)(
          unacceptedStudyIds.reduce((acc, id) => {
            acc[`${id}_sqon`] = {
              op: 'and',
              content: [
                ...sqon.content,
                {
                  op: 'not',
                  content: [
                    {
                      op: 'in',
                      content: {
                        field: 'acl',
                        value: approvedAcls,
                      },
                    },
                  ],
                },
                {
                  op: 'in',
                  content: {
                    field: 'participants.study.external_id',
                    value: [id],
                  },
                },
              ],
            };
            return acc;
          }, {}),
        ),
      ]);
      console.log('accepted', acceptedStudiesAggs, 'unaccepted', unacceptedStudiesAggs);

      setLoading(false);
      setUserDetails(userDetails);
    },
  }),
);

const Gen3Connected = ({
  state,
  effects,
  theme,
  userDetails,
  setUserDetails,
  setBadge,
  loading,
  ...props
}) => {
  const projectIds =
    !loading && userDetails.projects && Object.keys(userDetails.projects).length
      ? getStudyIds(userDetails)
      : null;

  setBadge(projectIds ? projectIds.length : null);

  return (
    <div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Column>
          {projectIds ? (
            <Gen3ProjectList projectIds={projectIds} />
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
