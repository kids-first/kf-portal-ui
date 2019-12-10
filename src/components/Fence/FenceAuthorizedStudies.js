import React, { Fragment } from 'react';
import { compose } from 'recompose';

import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import styled from 'react-emotion';
import { injectState } from 'freactal';
import { get } from 'lodash';

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
  withTheme,
  withHistory,
  injectState,
  fenceConnectionInitializeHoc,
)(({ fence, theme, history, state: { fenceStudies, fenceConnectionsInitialized } }) =>
  !fenceConnectionsInitialized ? (
    <Spinner />
  ) : (
    get(fenceStudies, `${fence}.authorizedStudies`, []).map(({ id, studyShortName }) => {
      const sqon = sqonForStudy(id);
      return (
        <ItemRowContainer key={id}>
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
                {'View data files'} <RightChevron width={10} fill={theme.primary} />
              </Span>
            </ExternalLink>
          </Column>
        </ItemRowContainer>
      );
    })
  ),
);

const FenceAuthorizedStudies = ({ fence, fenceUser }) => {
  return (
    <div css={styles}>
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
