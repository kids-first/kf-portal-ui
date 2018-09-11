import * as React from 'react';
import { compose, lifecycle, withState } from 'recompose';

import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';
import { css } from 'emotion';
import { truncate } from 'lodash';

import PlusIcon from 'icons/PlusCircleIcon';
import CheckIcon from 'icons/CircleCheckIcon';
import SlashIcon from 'icons/CircleSlashIcon';
import Spinner from 'react-spinkit';
import { withApi } from 'services/api';
import { graphql } from 'services/arranger';
import { getUser as getGen3User } from 'services/gen3';

const enhance = compose(
  injectState,
  withTheme,
  withState('showDetails', 'setShowDetails', false),
  withApi,
  lifecycle({
    async componentDidMount() {
      const {
        setAuthorizedFiles,
        setUnauthorizedFiles,
        setFileStudyData,
        setFileAuthInitialized,
      } = this.props.effects;
      const { api } = this.props;
      const sqon = this.props.sqon || {
        op: 'and',
        content: [],
      };

      // Get Gen3 permissions
      const userDetails = await getGen3User(api);
      const approvedAcls = Object.keys(userDetails.projects).sort();

      const acceptedStudyIds = await graphql(api)({
        query: `
          query AcceptedStudyIds($sqon: JSON) {
            file {
              aggregations (filters: $sqon, aggregations_filter_themselves: true){
                participants__study__external_id {
                  buckets {
                    key
                  }
                }
              }
            }
          }
        `,
        variables: {
          sqon: {
            op: 'and',
            content: [
              ...sqon.content,
              {
                op: 'in',
                content: {
                  field: 'acl',
                  value: approvedAcls,
                },
              },
            ],
          },
        },
      }).then(
        ({ data: { file: { aggregations: { participants__study__external_id: { buckets } } } } }) =>
          buckets.map(({ key }) => key),
      );

      const unacceptedStudyIds = await graphql(api)({
        query: `
          query UnacceptedStudyIds($sqon: JSON) {
            file {
              aggregations (filters: $sqon, aggregations_filter_themselves: true){
                participants__study__external_id {
                  buckets {
                    key
                  }
                }
              }
            }
          }
        `,
        variables: {
          sqon: {
            op: 'and',
            content: [
              ...sqon.content,
              {
                op: 'not',
                content: [
                  {
                    op: 'in',
                    content: {
                      field: 'acl',
                      value: approvedAcls,
                    },
                  },
                ],
              },
            ],
          },
        },
      }).then(
        ({ data: { file: { aggregations: { participants__study__external_id: { buckets } } } } }) =>
          buckets.map(({ key }) => key),
      );

      const acceptedStudiesAggs = await (!acceptedStudyIds.length
        ? []
        : graphql(api)({
            query: `
          query AcceptedStudiesAggs(${acceptedStudyIds.map(id => `$${id}_sqon: JSON`)}) {
            file {
              ${acceptedStudyIds
                .map(
                  id => `
                  ${id}: aggregations (filters: $${id}_sqon, aggregations_filter_themselves: true){
                    kf_id { buckets { key } }
                    participants__study__name { buckets { key } }
                  }
                `,
                )
                .join('')}
            }
          }
        `,
            variables: acceptedStudyIds.reduce((acc, id) => {
              acc[`${id}_sqon`] = {
                op: 'and',
                content: [
                  ...sqon.content,
                  {
                    op: 'in',
                    content: {
                      field: 'acl',
                      value: approvedAcls,
                    },
                  },
                  {
                    op: 'in',
                    content: {
                      field: 'participants.study.external_id',
                      value: [id],
                    },
                  },
                ],
              };
              return acc;
            }, {}),
          }).then(({ data: { file: aggregations } }) => {
            return acceptedStudyIds.map(id => {
              const aggregation = aggregations[id];
              const { kf_id: { buckets: fileIds } } = aggregation;
              const { participants__study__name: { buckets: studyNames } } = aggregation;
              return {
                id: id,
                files: fileIds,
                studyName: studyNames.map(({ key }) => key)[0],
              };
            });
          }));

      const unacceptedStudiesAggs = await (!unacceptedStudyIds.length
        ? []
        : graphql(api)({
            query: `
          query UnacceptedStudiesAggs(${unacceptedStudyIds.map(id => `$${id}_sqon: JSON`)}) {
            file {
              ${unacceptedStudyIds
                .map(
                  id => `
                  ${id}: aggregations (filters: $${id}_sqon, aggregations_filter_themselves: true){
                    kf_id { buckets { key } }
                    participants__study__name { buckets { key } }
                  }
                `,
                )
                .join('')}
            }
          }
        `,
            variables: unacceptedStudyIds.reduce((acc, id) => {
              acc[`${id}_sqon`] = {
                op: 'and',
                content: [
                  ...sqon.content,
                  {
                    op: 'not',
                    content: [
                      {
                        op: 'in',
                        content: {
                          field: 'acl',
                          value: approvedAcls,
                        },
                      },
                    ],
                  },
                  {
                    op: 'in',
                    content: {
                      field: 'participants.study.external_id',
                      value: [id],
                    },
                  },
                ],
              };
              return acc;
            }, {}),
          }).then(({ data: { file: aggregations } }) => {
            return unacceptedStudyIds.map(id => {
              const aggregation = aggregations[id];
              const { kf_id: { buckets: fileIds } } = aggregation;
              const { participants__study__name: { buckets: studyNames } } = aggregation;
              return {
                id: id,
                files: fileIds,
                studyName: studyNames.map(({ key }) => key)[0],
              };
            });
          }));

      setAuthorizedFiles(acceptedStudiesAggs.reduce((acc, study) => [...acc, ...study.files], []));
      setUnauthorizedFiles(
        unacceptedStudiesAggs.reduce((acc, study) => [...acc, ...study.files], []),
      );
      setFileStudyData({
        authorized: acceptedStudiesAggs
          .map(({ id, files, studyName }) => ({
            id: id,
            count: files.length,
          }))
          .filter(({ count }) => count)
          .sort(({ count }, { count: nextCount }) => nextCount - count),
        unauthorized: unacceptedStudiesAggs
          .map(({ id, files, studyName }) => ({
            id: id,
            count: files.length,
          }))
          .filter(({ count }) => count)
          .sort(({ count }, { count: nextCount }) => nextCount - count),
        names: [...acceptedStudiesAggs, ...unacceptedStudiesAggs].reduce(
          (acc, { id, studyName }) => ({
            ...acc,
            [id]: studyName,
          }),
          {},
        ),
      });
      setFileAuthInitialized(true);
    },
  }),
);

const styles = theme => css`
  border: solid 1px ${theme.greyScale5};

  button.showDetailsButton {
    border: solid 2px #fff;
    background-color: ${theme.greyScale10};
    font-size: 11px;
    color: ${theme.primary};
    width: 100%;
    font-align: center;
    cursor: pointer;
    padding: 6px;
    // margin: 2px;
  }

  .filePermissions {
    padding: 15px;
  }
  .summary {
    ${theme.row};
    .block {
      ${theme.row};
    }
  }
  .block {
    flex: 1;
    flex-direction: column;
    padding: 15px;
  }
  .right {
    border-left: solid 1px ${theme.greyScale5};
  }
  .summaryLabel {
    font-size: 13px;
    color: ${theme.greyScale1};
  }
  .summaryValue {
    padding-left: 20px;
  }

  .summaryValue .number {
    font-size: 18px;
    color: ${theme.greyScale1};
    padding: 4px;
  }
  .summaryValue .text {
    font-size: 13px;
    color: ${theme.greyScale9};
    padding: 3px;
  }
  .details {
    ${theme.row};
    border-top: solid 1px ${theme.greyScale5};
    .block {
      padding-bottom: 0px;
    }
  }
  .studyDetails {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 1em;
  }
  .studyDetails .number {
    font-weight: 500;
  }
  .studyName {
    padding-right: 25px;
  }
  .studyCount {
    white-space: nowrap;
  }
`;

const CavaticaFileSummary = ({
  state,
  theme,
  effects,
  showDetails,
  setShowDetails,
  authorizedFiles,
  unauthorizedFiles,
  fileStudyData,
  ...props
}) => {
  const showUnauth = !!(state.unauthorizedFiles && state.unauthorizedFiles.length > 0);
  const showAuth =
    state.authorizedFiles !== null && (state.authorizedFiles.length > 0 || showUnauth);
  return (
    <div>
      <span css={theme.modalHeader}>File Summary:</span>
      <div css={styles(theme)}>
        <div className="filePermissions">
          {!state.fileAuthInitialized && (
            <Spinner
              fadeIn="none"
              name="circle"
              color={theme.primary}
              style={{
                width: 15,
                height: 15,
                marginRight: 9,
                display: 'inline-block',
              }}
            />
          )}
          {showAuth && (
            <div className="summary">
              <div className="left block">
                <div className="summaryLabel">
                  <span>Authorized to copy:</span>
                </div>
                <div className="summaryValue">
                  <CheckIcon className="icon" width={18} height={18} fill={theme.active} />
                  <span className="number">{state.authorizedFiles.length}</span>
                  <span className="text">Files</span>
                </div>
              </div>

              {showUnauth && (
                <div className="right block">
                  <div className="summaryLabel">
                    <span>Unauthorized to copy:</span>
                  </div>
                  <div className="summaryValue">
                    <SlashIcon
                      className="summaryIcon"
                      width={18}
                      height={18}
                      fill={theme.errorDark}
                    />
                    <span className="number">{state.unauthorizedFiles.length}</span>
                    <span className="text">Files</span>
                  </div>
                </div>
              )}
            </div>
          )}
          {showDetails && (
            <div className="details">
              <div className="left block">
                {state.fileStudyData.authorized &&
                  state.fileStudyData.authorized.map(study => (
                    <div className="studyDetails">
                      <div className="studyName">
                        {truncate(state.fileStudyData.names[study.id], {
                          length: 50,
                          omission: '...',
                        })}
                      </div>
                      <div className="studyCount">
                        <span className="number">{study.count}</span> Files
                      </div>
                    </div>
                  ))}
              </div>
              <div className="right block">
                {state.fileStudyData.unauthorized &&
                  state.fileStudyData.unauthorized.map(study => (
                    <div className="studyDetails">
                      <div className="studyName">
                        {truncate(state.fileStudyData.names[study.id], {
                          length: 50,
                          omission: '...',
                        })}
                      </div>
                      <div className="studyCount">
                        <span className="number">{study.count}</span> Files
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
        {showUnauth &&
          state.fileStudyData && (
            <button
              className="showDetailsButton"
              onClick={() => {
                setShowDetails(!showDetails);
              }}
            >
              {showDetails ? (
                <div>
                  <PlusIcon
                    width={10}
                    height={10}
                    css={`
                      fill: ${theme.primary};
                      margin-top: 1px;
                      margin-right: 4px;
                    `}
                  />Close Details
                </div>
              ) : (
                <div>
                  <PlusIcon
                    width={10}
                    height={10}
                    css={`
                      fill: ${theme.primary};
                      margin-top: 1px;
                      margin-right: 4px;
                    `}
                  />File Details
                </div>
              )}
            </button>
          )}
      </div>
    </div>
  );
};

export default enhance(CavaticaFileSummary);
