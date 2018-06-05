import React from 'react';
import Spinner from 'react-spinkit';
import { Link } from 'react-router-dom';
import { distanceInWords } from 'date-fns';

import TrashIcon from 'react-icons/lib/fa/trash';
import { compose, lifecycle } from 'recompose';
import { injectState } from 'freactal';

import provideSavedQueries from 'stateProviders/provideSavedQueries';
import SaveIcon from '../../icons/SaveIcon';

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
      <div
        css={`
          display: flex;
          flex-direction: column;
          margin: 15px 0;
          flex: 3;
          border: 1px solid #e0e1e6;
          border-top: 0;
          border-bottom-right-radius: 10px;
          border-bottom-left-radius: 10px;
          padding: 0 10px;
        `}
      >
        <div
          css={`
            display: block;
            width: calc(100% + 22px);
            margin-left: -11px;
            height: 6px;
            background-image: linear-gradient(
              to right,
              ${profileColors.gradientDark},
              ${profileColors.gradientMid} 51%,
              ${profileColors.gradientLight}
            );
          `}
        />
        <div
          css={`
            display: flex;
            flex-grow: 1;
            padding: 10px 20px 30px;
            ${queries.length > 0 &&
              `
              border-bottom: 2px dotted #a9adc0;
            `};
          `}
        >
          <h4
            css={`
              ${theme.h4}
              font-family: ${theme.fonts.default};
              font-size: 20px;
              margin-top: 6px;
              font-weight: 100;
              color: ${theme.secondary};
            `}
          >
            Saved Queries
          </h4>
          <div
            css={`
              margin-left: auto;
              align-items: center;
              display: flex;
              align-items: baseline;
            `}
          >
            <SaveIcon
              css={`
                width: 16px;
                color: #a9adc0;
              `}
            />
            <span
              css={`
                font-size: 20px;
                padding: 0 6px 0 9px;
                font-size: 22px;
              `}
            >
              {queries.length}
            </span>
            <h3
              css={`
                ${theme.h3}
                font-size: 90%;
                color: ${theme.greyScale7};
              `}
            >
              Quer{queries.length === 1 ? 'y': 'ies'}
            </h3>
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
                  padding: 10px 10px 10px 25px;
                  border: 1px solid #e0e1e6;
                  border-bottom: 0;
                  transition-property: opacity;
                    
                  ${deletingIds.includes(q.id) &&
                    `opacity: 0.6;
            pointer-events: none;`} &:last-child {
                    border-bottom: 1px solid #e0e1e6;
                  }
                `}
              >
                <div
                  css={`
                    display: flex;
                    flex-direction: column;
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
                      css={`${theme.internalLink}`}
                    >
                      {q.alias}
                    </Link>
                    <div
                      css={`
                        padding: 0 5px;
                      `}
                    >
                      <TrashIcon
                        css={`${theme.internalLink}`}
                        onClick={() => deleteQuery({ api, queryId: q.id })}
                      />
                    </div>
                  </div>
                  <p
                    css={`
                      ${theme.paragraph}
                      ${theme.text.small}
                      margin: 8px 0;
                      color: ${theme.greyScale9};
                      letter-spacing: 0.3px;
                      b {
                        color: #343434;
                        padding-right: 3px;
                      }
                      span {
                        margin: 0 5px;
                      }
                    `}
                  >
                    <b>{(q.content.Files || 0).toLocaleString()}</b> Files <span>|{' '}</span>
                    <b>{(q.content.Participants || 0).toLocaleString()}</b> Participants <span>|{' '}</span>
                    <b>{(q.content.Families || 0).toLocaleString()}</b> Families <span>|{' '}</span>
                    <b>{q.content.Size}</b>
                  </p>
                  <p
                    css={`
                      ${theme.paragraph}
                      ${theme.text.small}
                      margin: 0;
                    `}
                  >
                    Saved {distanceInWords(new Date(), new Date(q.creationDate))} ago
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    ),
);
export default MySavedQueries;
