import React from 'react';
import Component from 'react-component-component';
import urlJoin from 'url-join';
import Spinner from 'react-spinkit';
import { Link } from 'react-router-dom';
import { distanceInWords } from 'date-fns';
import SaveIcon from 'react-icons/lib/fa/floppy-o';
import TrashIcon from 'react-icons/lib/fa/trash';
import { shortUrlApi } from 'common/injectGlobals';
import { StyledH3 } from './styles';
import { xor } from 'lodash';

const getQueries = async ({ setState, egoId }) => {
  // TODO: ajax service
  let response = await fetch(urlJoin(shortUrlApi, 'user', egoId)).then(r => r.json());

  setState({ queries: response.value, loading: false });
};

const MySavedQueries = ({ loggedInUser, theme }) => (
  <Component
    initialState={{ queries: [], loading: true, deletingIds: [] }}
    didMount={async ({ setState }) => {
      getQueries({ setState, egoId: loggedInUser.egoId });
    }}
    didUpdate={async ({ setState }) => {
      getQueries({ setState, egoId: loggedInUser.egoId });
    }}
    render={({ state, setState }) =>
      state.loading ? (
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
            margin-top: 15px;
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
              background-image: linear-gradient(to right, #404c9a, #009bb8 51%, #02b0ed);
            `}
          />
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
              Saved Queries
            </StyledH3>
            <div
              css={`
                margin-left: auto;
                align-items: end;
                display: flex;
                line-height: 27px;
              `}
            >
              <span
                css={`
                  margin-top: -2px;
                `}
              >
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
          {state.queries.length > 0 ? (
            <div
              css={`
                display: block;
                width: 100%;
                height: 1px;
                background-image: linear-gradient(to right, #a9adc0 10%, rgba(255, 255, 255, 0) 0%);
                background-position: top;
                background-size: 5px 1px;
                background-repeat: repeat-x;
              `}
            />
          ) : null}
          <div
            css={`
              overflow: auto;
              margin: 6px 0 16px;
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
                    display: flex;
                    padding: 10px 10px 10px 25px;
                    border: 1px solid #e0e1e6;
                    border-bottom: 0;
                    transition-property: opacity;

                    ${state.deletingIds.includes(q.id) &&
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
                          onClick={async () => {
                            setState({ ...state, deletingIds: [...state.deletingIds, q.id] });
                            fetch(urlJoin(shortUrlApi, q.id), {
                              method: 'DELETE',
                              headers: {
                                'Content-type': 'application/json',
                              },
                            }).then(r =>
                              setState({ ...state, deletingIds: xor([q.id], state.deletingIds) }),
                            );
                          }}
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
                      <span>{q.content.Files.toLocaleString()}</span> Files |{' '}
                      <span>{q.content.Participants.toLocaleString()}</span> Participants |{' '}
                      <span>{q.content.Families.toLocaleString()}</span> Families |{' '}
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
      )
    }
  />
);

export default MySavedQueries;
