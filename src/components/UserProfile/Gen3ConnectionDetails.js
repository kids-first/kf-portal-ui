import React, { Fragment } from 'react';
import { compose, lifecycle, withState } from 'recompose';

import { getUser as getGen3User, getStudyIds } from 'services/gen3';
import { css } from 'emotion';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';
import { get } from 'lodash';
import Query from '@arranger/components/dist/Query';
import styled from 'react-emotion';
import { Trans } from 'react-i18next';

import { LoadingSpinner } from './UserIntegrations';
import Row from 'uikit/Row';
import Column from 'uikit/Column';
import { toGqlString } from 'services/utils';
import ExternalLink from 'uikit/ExternalLink';
import { Span } from 'uikit/Core';
import { PromptMessageContainer } from 'uikit/PromptMessage';
import RightChevron from 'icons/DoubleChevronRightIcon';
import StackIcon from 'icons/StackIcon';
import { withHistory } from 'services/history';
import { withApi } from 'services/api';
import { arrangerGqlRecompose } from 'services/arranger';
import { arrangerProjectId } from 'common/injectGlobals';

const styles = css`
  table {
    border-collapse: collapse;
  }
  span.title {
    font-weight: bold;
    padding: 15px;
  }
`;

const ItemRowContainer = styled(Row)`
  padding-top: 5px;
  padding-bottom: 5px;
  min-height: 50px;
  padding-right: 10%;
  &:not(:last-child) {
    border-bottom: solid 1px ${({ theme }) => theme.borderGrey};
  }
`;

const Spinner = () => (
  <Row justifyContent={'center'}>
    <LoadingSpinner width={20} height={20} />
  </Row>
);

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
      setLoading(false);
      setUserDetails(userDetails);
    },
  }),
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

const Gen3ProjectList = compose(
  withApi,
  withTheme,
  withHistory,
)(({ projectIds, api, theme, history }) => (
  <Query
    renderError
    api={arrangerGqlRecompose(api)}
    projectId={arrangerProjectId}
    name={`gen3ItemQuery`}
    shouldFetch={true}
    query={`
        query (${projectIds.map(id => `$${toGqlString(id)}_sqon: JSON`).join(', ')}){
          file {${projectIds
            .map(
              id => `${toGqlString(id)}: aggregations(filters: ${`$${toGqlString(id)}_sqon`}) {
                participants__study__short_name {
                  buckets {
                    key
                  }
                }
              }
            `,
            )
            .join('')}
          }
        }
      `}
    variables={projectIds.reduce(
      (acc, id) => ({
        ...acc,
        [`${toGqlString(id)}_sqon`]: sqonForStudy(id),
      }),
      {},
    )}
    render={({ loading, data }) => {
      const aggregations = get(data, 'file');
      return aggregations ? (
        projectIds
          .filter(id =>
            get(aggregations, `${toGqlString(id)}.participants__study__short_name.buckets.length`),
          )
          .map(id => {
            const studyNameBuckets = get(
              aggregations,
              `${toGqlString(id)}.participants__study__short_name.buckets`,
            );
            const studyName = studyNameBuckets[0];
            const sqon = sqonForStudy(id);
            return (
              <ItemRowContainer>
                <Column justifyContent="center" p={15}>
                  <StackIcon width={20} />
                </Column>
                <Column flex={1} justifyContent="center" pr={10}>
                  <Span>
                    <strong>{studyName ? `${studyName.key} ` : ''}</strong>({id})
                  </Span>
                </Column>
                <Column justifyContent="center">
                  <ExternalLink hasExternalIcon={false}>
                    <Span
                      onClick={() =>
                        history.push(`/search/file?sqon=${encodeURI(JSON.stringify(sqon))}`)
                      }
                    >
                      {' '}
                      <Trans>View data files</Trans>
                      <RightChevron width={10} fill={theme.primary} />
                    </Span>
                  </ExternalLink>
                </Column>
              </ItemRowContainer>
            );
          })
      ) : (
        <Spinner />
      );
    }}
  />
));

const Gen3ConnectionDetails = ({
  state,
  effects,
  theme,
  userDetails,
  setUserDetails,
  loading,
  ...props
}) => (
  <div css={styles}>
    {loading ? (
      <Spinner />
    ) : (
      <Column>
        {userDetails.projects && Object.keys(userDetails.projects).length ? (
          <Fragment>
            <Row my={10}>
              <Span className="title" fontWeight={'bold'}>
                {' '}
                You have access to controlled datasets from the following studies:
              </Span>
            </Row>
            <Column pl={15}>
              <Gen3ProjectList projectIds={getStudyIds(userDetails)} />
            </Column>
          </Fragment>
        ) : (
          <Row>
            <PromptMessageContainer warning mb={0} width={'100%'}>
              <Span className="title" fontWeight={'bold'}>
                <Trans>You do not have access to any studies.</Trans>
              </Span>
            </PromptMessageContainer>
          </Row>
        )}
      </Column>
    )}
  </div>
);

export default enhance(Gen3ConnectionDetails);
