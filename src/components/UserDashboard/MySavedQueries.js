import React from 'react';
import Spinner from 'react-spinkit';
import { Link } from 'react-router-dom';
import { distanceInWords } from 'date-fns';

import { StyledH3 } from './styles';
import { compose, lifecycle } from 'recompose';
import { injectState } from 'freactal';

import provideSavedQueries from 'stateProviders/provideSavedQueries';
import SaveIcon from '../../icons/SaveIcon';
import TrashIcon from '../../icons/TrashIcon';

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
      <div className={`mySavedQueries ${theme.mySavedQueries({ theme, profileColors })}`}>
        <div className={'gradientBar'} />
        <div className={`header ${queries.length > 0 ? 'hascontent' : ''}`}>
          <StyledH3>Saved Queries</StyledH3>
          <div className={`queryCount`}>
            <SaveIcon />
            <span className={`queryCountNumber`}>{queries.length}</span>
            <span className={`label`}>Queries</span>
          </div>
        </div>

        <div className={`queriesListContainer`}>
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
                className={`queriesListItem ${deletingIds.includes(q.id) ? 'deleting' : ''}`}
              >
                <div className={`${theme.column} itemContent`}>
                  <div className={`${theme.row} heading`}>
                    <Link to={q.link} className={`titleLink`}>
                      {q.alias}
                    </Link>
                    <div className={`deleteButton`}>
                      <TrashIcon onClick={() => deleteQuery({ api, queryId: q.id })} />
                    </div>
                  </div>
                  <div className={`queryStats`}>
                    <span>{(q.content.Files || 0).toLocaleString()}</span> Files |{' '}
                    <span>{(q.content.Participants || 0).toLocaleString()}</span> Participants |{' '}
                    <span>{(q.content.Families || 0).toLocaleString()}</span> Families |{' '}
                    <span>{q.content.Size}</span>
                  </div>
                  <div className={`savedDate`}>
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
