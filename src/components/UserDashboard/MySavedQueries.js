import React from 'react';
import Spinner from 'react-spinkit';
import { Link } from 'react-router-dom';
import { distanceInWords } from 'date-fns';

import TrashIcon from 'react-icons/lib/fa/trash';
import { compose, lifecycle } from 'recompose';
import { injectState } from 'freactal';

import provideSavedQueries from 'stateProviders/provideSavedQueries';
import SaveIcon from '../../icons/SaveIcon';
import { H3, P, SmallText } from '../../uikit/Typography';
import DashboardWidget, { WidgetTitle } from './DashboardWidget';

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
      <div
        css={`
          flex-grow: 1;
        `}
      >
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
      </div>
    ) : (
      <DashboardWidget {...{ theme, profileColors }}>
        <div
          css={`
            display: flex;
            flex-grow: 1;
            padding: 10px 20px 10px;
            ${queries.length > 0 &&
              `
              border-bottom: 2px dotted #a9adc0;
            `};
          `}
        >
          <WidgetTitle>Saved Queries</WidgetTitle>
          <div
            css={`
              margin-left: auto;
              align-items: center;
              display: flex;
              align-items: baseline;
              margin-top: 3px;
            `}
          >
            <SaveIcon
              css={`
                width: 16px;
                color: #a9adc0;
              `}
            />

            <H3 m="0">
              <span
                css={`
                  padding: 0 6px 0 9px;
                `}
              >
                {queries.length}
              </span>
              <SmallText my="0" lineHeight={1} color="greyScale9">
                Quer{queries.length === 1 ? 'y' : 'ies'}
              </SmallText>
            </H3>
          </div>
        </div>

        <div
          css={`
            overflow: auto;
            margin: 6px 0 16px;
          `}
        >
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
              <div
                key={q.id}
                css={`
                  display: flex;
                  padding: 10px 10px 10px 20px;
                  border: 1px solid ${theme.colors.greyScale5};
                  border-bottom: 0;
                  transition-property: opacity;

                  ${deletingIds.includes(q.id) &&
                    `opacity: 0.6;
            pointer-events: none;`} &:last-child {
                    border-bottom: 1px solid ${theme.colors.greyScale5};
                  }
                `}
              >
                <div
                  css={`
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                  `}
                >
                  <div
                    css={`
                      ${theme.row};
                      justify-content: space-between;
                      width: 100%;
                    `}
                  >
                    <Link
                      to={q.link}
                      css={`
                        ${theme.internalLink};
                        font-weight: ${theme.fontWeights.bold};
                        font-size: ${theme.fontSizes[1]}px;
                      `}
                    >
                      {q.alias}
                    </Link>
                    <div
                      css={`
                        padding: 0 5px;
                      `}
                    >
                      <TrashIcon
                        css={`
                          ${theme.internalLink};
                        `}
                        onClick={() => deleteQuery({ api, queryId: q.id })}
                      />
                    </div>
                  </div>

                  <P
                    my="0"
                    leterSpacing={0.3}
                    css={`
                      b {
                        padding-right: 3px;
                      }
                      span {
                        margin: 0 5px;
                      }
                    `}
                  >
                    <SmallText>
                      <b>{(q.content.Files || 0).toLocaleString()}</b> Files <span>| </span>
                      <b>{(q.content.Participants || 0).toLocaleString()}</b> Participants{' '}
                      <span>| </span>
                      <b>{(q.content.Families || 0).toLocaleString()}</b> Families <span>| </span>
                      <b>{q.content.Size}</b>
                    </SmallText>
                  </P>
                  <p
                    css={`
                      ${theme.paragraph} ${theme.text.small} margin: 0;
                    `}
                  >
                    Saved {distanceInWords(new Date(), new Date(q.creationDate))} ago
                  </p>
                </div>
              </div>
            ))}
        </div>
      </DashboardWidget>
    ),
);
export default MySavedQueries;
