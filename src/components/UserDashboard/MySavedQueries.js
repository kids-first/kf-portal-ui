import React from 'react';
import Spinner from 'react-spinkit';
import { distanceInWords } from 'date-fns';
import styled from 'react-emotion';

import TrashIcon from 'react-icons/lib/fa/trash';
import { H3 } from './styles';
import { compose, lifecycle } from 'recompose';
import { injectState } from 'freactal';

import provideSavedQueries from 'stateProviders/provideSavedQueries';
import SaveIconBase from '../../icons/SaveIcon';

import { H2 } from 'uikit/Headings';
import { Box, Flex, Span, Link } from 'uikit/Core';
import Column from 'uikit/Column';
import Row from 'uikit/Row';

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

const Detail = styled(Span)`
  color: ${({ theme }) => theme.greyScale1};
`;

const Query = styled(Flex)`
  padding: 10px 10px 10px 25px;
  border: 1px solid ${({ theme }) => theme.greyScale5};
  transition-property: opacity;
  ${({ inactive, theme }) =>
    inactive
      ? `
          opacity: 0.6;
          pointer-events: none;
          &:last-child {
            border-bottom: 1px solid ${({ theme }) => theme.greyScale5};
          }
        `
      : ``};
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
            .map(q => (
              <Query key={q.id} inactive={deletingIds.includes(q.id)}>
                <Column width="100%">
                  <Row justifyContent="space-between" width="100%">
                    <Link fontSize={1} fontWeight="bold" color={theme.primary} to={q.link}>
                      {q.alias}
                    </Link>
                    <Box pr={2} pl={2}>
                      <Span
                        color={theme.primary}
                        hover={{ cursor: 'pointer', color: theme.hover }}
                        onClick={() => deleteQuery({ api, queryId: q.id })}
                      >
                        <TrashIcon />
                      </Span>
                    </Box>
                  </Row>
                  <Box mt={2} mb={2} color={theme.greyScale9} fontSize="0.75rem">
                    <Detail>{(q.content.Files || 0).toLocaleString()}</Detail> Files |{' '}
                    <Detail>{(q.content.Participants || 0).toLocaleString()}</Detail> Participants |{' '}
                    <Detail>{(q.content.Families || 0).toLocaleString()}</Detail> Families |{' '}
                    <Detail>{q.content.Size}</Detail>
                  </Box>
                  <Box fontSize="0.75rem">
                    Saved {distanceInWords(new Date(), new Date(q.creationDate))} ago
                  </Box>
                </Column>
              </Query>
            ))}
        </Box>
      </Container>
    ),
);
export default MySavedQueries;
