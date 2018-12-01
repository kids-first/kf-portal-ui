import React from 'react';
import { distanceInWords } from 'date-fns';
import TrashIcon from 'react-icons/lib/fa/trash';
import styled from 'react-emotion';
import { compose } from 'recompose';

import { injectState } from 'freactal';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import { Box, Flex, Span, Link as Linkbase } from 'uikit/Core';
import Column from 'uikit/Column';
import Row from 'uikit/Row';
import { withTheme } from 'emotion-theming';
import { withApi } from 'services/api';

const Detail = styled(Span)`
  color: ${({ theme }) => theme.greyScale1};
  font-family: ${({ theme }) => theme.fonts.details};
`;

const Query = styled(Flex)`
  padding: 10px 10px 10px 0;
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

const Link = styled(Linkbase)`
  font-family: ${({ theme }) => theme.fonts.details};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
`;

const DetailBox = styled(Box)`
  font-size: 12px;
  margin: 2px 0;
  color: ${({ theme }) => theme.greyScale1};
  font-family: ${({ theme }) => theme.fonts.details};
`;

const DetailHeading = styled('span')`
  color: ${({ theme }) => theme.greyScale9};
`;

const QueryBlock = compose(
  injectState,
  withApi,
  withTheme,
)(({ effects: { deleteQuery }, api, query: q, inactive = false, theme, savedTime = true }) => (
  <Query inactive={inactive}>
    <Column width="100%">
      <Row justifyContent="space-between" width="100%">
        <Link
          onClick={() => {
            trackUserInteraction({
              category: TRACKING_EVENTS.categories.user.dashboard.widgets.savedQueries,
              action: `${TRACKING_EVENTS.actions.click} Saved Query Title`,
              label: JSON.stringify(q),
            });
          }}
          to={q.link}
        >
          {q.alias}
        </Link>
        <Box pr={2} pl={2}>
          <Span
            color={theme.primary}
            hover={{ cursor: 'pointer', color: theme.hover }}
            onClick={() => {
              trackUserInteraction({
                category: TRACKING_EVENTS.categories.user.dashboard.widgets.savedQueries,
                action: TRACKING_EVENTS.actions.query.delete,
                label: JSON.stringify(q),
              });
              deleteQuery({ api, queryId: q.id });
            }}
          >
            <TrashIcon />
          </Span>
        </Box>
      </Row>
      <DetailBox>
        <Detail>{(q.content.Files || 0).toLocaleString()}</Detail>{' '}
        <DetailHeading>Files | </DetailHeading>
        <Detail>{(q.content.Participants || 0).toLocaleString()}</Detail>{' '}
        <DetailHeading>Participants | </DetailHeading>
        <Detail>{(q.content.Families || 0).toLocaleString()}</Detail>
        <DetailHeading> Families | </DetailHeading>
        <Detail>{q.content.Size}</Detail>
      </DetailBox>
      {savedTime ? (
        <DetailBox>Saved {distanceInWords(new Date(), new Date(q.creationDate))} ago</DetailBox>
      ) : null}
    </Column>
  </Query>
));

export default QueryBlock;
