import React, { Fragment } from 'react';
import Spinner from 'react-spinkit';
import styled from 'react-emotion';

import TrashIcon from 'react-icons/lib/fa/trash';
import { H2 } from 'uikit/Headings';
import { H3 } from './styles';
import { compose, lifecycle } from 'recompose';
import { injectState } from 'freactal';

import provideSavedQueries from 'stateProviders/provideSavedQueries';
import SaveIconBase from 'icons/SaveIcon';

import { Box, Flex, Span, Link } from 'uikit/Core';
import Column from 'uikit/Column';
import {
  PromptMessageContainer,
  PromptMessageHeading,
  PromptMessageContent,
} from 'uikit/PromptMessage';

import QueryBlock from './QueryBlock';

const SaveIcon = styled(SaveIconBase)`
  width: 16px;
  fill: ${({ theme }) => theme.greyScale11};
`;

const QueriesHeading = styled('h4')`
  font-size: 16px;
  font-weight: 600;
  line-height: 1.75;
  color: ${({ theme }) => theme.greyScale1};
  margin-bottom: 7px;
  margin-top: 0;
  border-bottom: 1px solid ${({ theme }) => theme.greyScale5};
`;

const GradientBar = styled('div')`
  display: block;
  width: calc(100% + 22px);
  margin-left: -11px;
  height: 6px;
  background-image: linear-gradient(
    to right,
    ${({ profileColors }) => profileColors.gradientDark},
    ${({ profileColors }) => profileColors.gradientMid} 51%,
    ${({ profileColors }) => profileColors.gradientLight}
  );
`;

const Header = styled(Flex)`
  align-items: center;
  border-bottom: ${({ queries, theme }) =>
    queries.length ? `2px dotted ${theme.greyScale5}` : `none`};
`;

const Container = styled(Column)`
  margin: 15px 0;
  flex: 3;
  border: 1px solid ${({ theme }) => theme.greyScale11};
  border-top: 0;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  padding: 0 10px;
  overflow-y: auto;
`;

const MySavedQueries = compose(
  provideSavedQueries,
  injectState,
  lifecycle({
    componentDidMount() {
      const { api } = this.props;
      this.props.effects.getQueries({ egoId: this.props.loggedInUser.egoId, api });
    },
  }),
)(
  ({
    state: { queries, exampleQueries, loadingQueries, deletingIds },
    effects: { getQueries, deleteQuery },
    api,
    theme,
    profileColors,
  }) =>
    loadingQueries ? (
      <Box flexGrow={1}>
        <Spinner
          fadeIn="none"
          name="circle"
          color="purple"
          style={{
            width: 15,
            height: 15,
            margin: '20px auto',
            padding: 5,
          }}
        />
      </Box>
    ) : (
      <Container>
        <GradientBar {...{ profileColors }} />
        <Header p={3} lineHeight={2} {...{ queries }}>
          <H2 mt={2}>Saved Queries</H2>
          <Flex ml="auto" alignItems="center">
            <SaveIcon />
            <Span pr={2} pl={3} fontSize={3}>
              {queries.length}
            </Span>
            <Span fontSize={2} color={theme.greyScale11}>
              Queries
            </Span>
          </Flex>
        </Header>
        {!queries.length ? (
          <PromptMessageContainer info my={20}>
            <PromptMessageHeading info mb={10}>
              You have no saved queries yet.
            </PromptMessageHeading>
            <PromptMessageContent>
              Explore the{' '}
              <Link to="/search/file" style={{ textDecoration: 'none' }}>
                File Repository
              </Link>{' '}
              and start saving queries!
            </PromptMessageContent>
          </PromptMessageContainer>
        ) : null}
        <Fragment>
          <Box mt={2} mb={2}>
            {queries
              .filter(q => q.alias)
              .map(q => ({
                ...q,
                date: Number(new Date(q.creationDate)),
                link: `/search${q.content.longUrl.split('/search')[1]}`,
              }))
              .slice()
              .sort((a, b) => b.date - a.date)
              .map(q => <QueryBlock key={q.id} query={q} inactive={deletingIds.includes(q.id)} />)}
          </Box>

          {!exampleQueries.length ? null : (
            <Box mt={2} mb={2}>
              <QueriesHeading>Examples:</QueriesHeading>
              {exampleQueries.map(q => {
                q.link = `/search${q.content.longUrl.split('/search')[1]}`;
                return (
                  <QueryBlock
                    key={q.id}
                    query={q}
                    inactive={deletingIds.includes(q.id)}
                    savedTime={false}
                  />
                );
              })}
            </Box>
          )}
        </Fragment>
      </Container>
    ),
);
export default MySavedQueries;
