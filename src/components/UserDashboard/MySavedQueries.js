import React from 'react';
import Spinner from 'react-spinkit';
import { Link } from 'react-router-dom';
import { distanceInWords } from 'date-fns';

import TrashIcon from 'react-icons/lib/fa/trash';
import { StyledH3 } from './styles';
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
      <div className={`mySavedQueries`}>
        <div
          className={'gradientBar'}
          css={`
            background-image: linear-gradient(
              to right,
              ${profileColors.gradientDark},
              ${profileColors.gradientMid} 51%,
              ${profileColors.gradientLight}
            );
          `}
        />
        <div className={`header ${queries.length > 0 ? 'hascontent' : ''}`}>
          <StyledH3>Saved Queries</StyledH3>
          <div className={`queryCount`}>
            <SaveIcon />
            <span className={`queryCountNumber`}>{queries.length}</span>
            <span className={`label`}>Queries</span>
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
                      css={`
                        font-size: 0.875em;
                        color: #a42c90;
                        font-weight: bold;
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
                          color: #a42c90;
                          &:hover {
                            cursor: pointer;
                            color: ${theme.hover};
                          }
                        `}
                        onClick={() => deleteQuery({ api, queryId: q.id })}
                      />
                    </div>
                  </div>
                  <div
                    css={`
                      margin: 10px 0;
                      color: #74757d;
                      font-size: 0.75em;
                      letter-spacing: 0.3px;

                      span {
                        color: #343434;
                      }
                    `}
                  >
                    <span>{(q.content.Files || 0).toLocaleString()}</span> Files |{' '}
                    <span>{(q.content.Participants || 0).toLocaleString()}</span> Participants |{' '}
                    <span>{(q.content.Families || 0).toLocaleString()}</span> Families |{' '}
                    <span>{q.content.Size}</span>
                  </div>
                  <div
                    css={`
                      font-size: 0.75em;
                    `}
                  >
                    Saved {distanceInWords(new Date(), new Date(q.creationDate))}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    ),
);
export default MySavedQueries;
