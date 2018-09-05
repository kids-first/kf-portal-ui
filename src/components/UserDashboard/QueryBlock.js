import React from 'react';
import { distanceInWords } from 'date-fns';
import TrashIcon from 'react-icons/lib/fa/trash';
import styled from 'react-emotion';
import { compose } from 'recompose';

import provideSavedQueries from 'stateProviders/provideSavedQueries';
import { injectState } from 'freactal';

import { Box, Flex, Span, Link } from 'uikit/Core';
import Column from 'uikit/Column';
import Row from 'uikit/Row';
import { withTheme } from 'emotion-theming';
import { withApi } from 'services/api';

const Detail = styled(Span)`
  color: ${({ theme }) => theme.greyScale1};
`;

const Query = styled(Flex)`
  padding: 10px 10px 10px 25px;
  border-bottom: 1px solid ${({ theme }) => theme.greyScale5};
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

const QueryBlock = compose(provideSavedQueries, injectState, withApi, withTheme)(
  ({ effects: { deleteQuery }, api, query: q, inactive = false, theme, savedTime = true }) => (
    <Query inactive={inactive}>
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
        {savedTime ? (
          <Box fontSize="0.75rem">
            Saved {distanceInWords(new Date(), new Date(q.creationDate))} ago
          </Box>
        ) : null}
      </Column>
    </Query>
  ),
);

export default QueryBlock;
