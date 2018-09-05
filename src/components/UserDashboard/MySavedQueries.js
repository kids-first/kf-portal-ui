import React from 'react';
import Spinner from 'react-spinkit';
import styled from 'react-emotion';

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
import DefaultSavedQueries from './DefaultSavedQueries';

const SaveIcon = styled(SaveIconBase)`
  width: 16px;
  fill: ${({ theme }) => theme.greyScale11};
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
  border-bottom: ${x => (x.queries.length ? `2px dotted ${x.theme.greyScale5}` : `none`)};
`;

const Container = styled(Column)`
  margin: 15px 0;
  flex: 3;
  border: 1px solid ${({ theme }) => theme.greyScale11};
  border-top: 0;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  padding: 0 10px;
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
    state: { queries, loadingQueries, deletingIds },
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
          <H3 mt={2} fontWeight={300}>
            Saved Queries
          </H3>
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
        {queries.length <= 0 ? (
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
        ) : (
          <Box overflowY="auto" mt={2} mb={2}>
            {queries
              .filter(q => q.alias)
              .map(q => ({
                ...q,
                date: +new Date(q.creationDate),
                // TODO: save origin + pathname separately in dynamo
                link: `/search${q.content.longUrl.split('/search')[1]}`,
              }))
              .slice()
              .sort((a, b) => b.date - a.date)
              .map(q => <QueryBlock key={q.id} query={q} inactive={deletingIds.includes(q.id)} />)}
            <DefaultSavedQueries />
          </Box>
        )}
      </Container>
    ),
);
export default MySavedQueries;
