import React from 'react';
import Component from 'react-component-component';
import urlJoin from 'url-join';
import { Link } from 'react-router-dom';
import { distanceInWords } from 'date-fns';
import SaveIcon from 'react-icons/lib/fa/floppy-o';
import { shortUrlApi } from 'common/injectGlobals';
import { StyledH3 } from './styles';

const MySavedQueries = ({ loggedInUser }) => (
  <Component
    initialState={{ queries: [] }}
    didMount={async ({ setState }) => {
      let response = await fetch(urlJoin(shortUrlApi, 'user', loggedInUser.egoId)).then(r =>
        r.json(),
      );

      setState({ queries: response.value });
    }}
    render={({ state }) => (
      <div
        css={`
          display: flex;
          flex-direction: column;
          margin-top: 15px;
          flex: 2;
          border-top: 6px solid #41a7d5;
        `}
      >
        <div
          css={`
            display: flex;
            flex-grow: 1;
            padding: 10px 20px;
            margin-bottom: 20px;
          `}
        >
          <StyledH3
            css={`
              margin-top: 6px;
              font-weight: 300;
            `}
          >
            My Saved Queries
          </StyledH3>
          <div
            css={`
              margin-left: auto;
              align-items: end;
              display: flex;
            `}
          >
            <span>
              <SaveIcon />
            </span>
            <span
              css={`
                padding: 0 5px;
                font-size: 22px;
              `}
            >
              {state.queries.length}
            </span>
            <span>Queries</span>
          </div>
        </div>
        <div
          css={`
            overflow: auto;
            margin-bottom: 30px;
          `}
        >
          {state.queries
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
                  height: 75px;
                  display: flex;
                  padding: 10px;
                `}
              >
                <div
                  css={`
                    display: flex;
                    flex-direction: column;
                  `}
                >
                  <Link
                    to={q.link}
                    css={`
                      color: purple;
                      font-weight: bold;
                    `}
                  >
                    {q.alias}
                  </Link>
                  <div
                    css={`
                      margin: 10px 0;
                      color: #6f6f6f;
                      font-size: 0.8em;
                      letter-spacing: 0.3px;
                    `}
                  >
                    {q.content.Participants.toLocaleString()} Participants |{' '}
                    {q.content.Families.toLocaleString()} Families |{' '}
                    {q.content.Files.toLocaleString()} Files | {q.content.Size}
                  </div>
                  <div
                    css={`
                      font-size: 0.8em;
                    `}
                  >
                    Saved {distanceInWords(new Date(), new Date(q.creationDate))}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    )}
  />
);

export default MySavedQueries;
