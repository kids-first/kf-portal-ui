import React from 'react';
import { distanceInWords } from 'date-fns';
import TrashIcon from 'react-icons/lib/fa/trash';
import { compose } from 'recompose';
import { injectState } from 'freactal';

import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import { Box, Flex, Span, Link } from 'uikit/Core';
import Column from 'uikit/Column';
import Row from 'uikit/Row';
import { withApi } from 'services/api';
import { styleComponent } from 'components/Utils';

import {
  query,
  detail,
  queryLink,
  detailBox,
  detailHeading,
  studyDeleteWrapper,
} from './SavedQueries.module.css';

const Detail = styleComponent(Span, detail);
const DetailBox = styleComponent(Box, detailBox);
const DetailHeading = styleComponent('span', detailHeading);

export default compose(
  injectState,
  withApi,
)(({ effects: { deleteQuery }, api, query: q, inactive = false, savedTime = true }) => (
  <Flex className={`${query} ${inactive ? 'inactive' : ''}`}>
    <Column width="100%">
      <Row justifyContent="space-between" width="100%">
        <Link
          className={queryLink}
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
            className={studyDeleteWrapper}
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
  </Flex>
));
