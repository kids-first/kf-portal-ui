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
import { getUserStudyPermission } from 'services/fileAccessControl';

import { FENCES } from 'common/constants';

const shapeStudyAggs = (studyAggs = []) =>
  studyAggs
    .filter(({ files }) => files.length > 0)
    .map(({ id, files }) => ({
      id: id,
      count: files.length,
    }))
    .sort(({ count }, { count: nextCount }) => nextCount - count);

const enhance = compose(
  injectState,
  withTheme,
  withState('showDetails', 'setShowDetails', false),
  withApi,
  lifecycle({
    async componentDidMount() {
      const {
        api,
        state: { fenceConnections },
        effects: {
          setAuthorizedFiles,
          setUnauthorizedFiles,
          setFileStudyData,
          setFileAuthInitialized,
        },
      } = this.props;
      const sqon = this.props.sqon || {
        op: 'and',
        content: [],
      };

      // Get the Study Permission breakdown directly for FileStudyData and UnauthorizedFiles
      const { acceptedStudiesAggs, unacceptedStudiesAggs } = await getUserStudyPermission(
        api,
        fenceConnections,
        {
          sqon,
        },
      );

      setFileStudyData({
        authorized: shapeStudyAggs(acceptedStudiesAggs),
        unauthorized: shapeStudyAggs(unacceptedStudiesAggs),
        names: [...acceptedStudiesAggs, ...unacceptedStudiesAggs].reduce(
          (acc, { id, studyName }) => ({
            ...acc,
            [id]: studyName,
          }),
          {},
        ),
      });

      setUnauthorizedFiles(
        unacceptedStudiesAggs
          .reduce((acc, study) => [...acc, ...study.files], [])
          .map(({ key }) => key),
      );

      // Authorized files needs to be broken down by repository, so lets dig deeper
      const authFiles = {};
      const fencePromises = [];
      FENCES.forEach(fence => {
        const fenceSqon = {
          op: 'and',
          content: [
            sqon,
            {
              op: 'in',
              content: {
                field: 'repository',
                value: [fence],
              },
            },
          ],
        };
        const promise = getUserStudyPermission(api, fenceConnections, {
          sqon: fenceSqon,
        }).then(response => {
          authFiles[fence] = response.acceptedStudiesAggs
            .reduce((acc, study) => [...acc, ...study.files], [])
            .map(({ key }) => key);
          return true;
        });

        fencePromises.push(promise);
      });

      await Promise.all(fencePromises);
      await setAuthorizedFiles(authFiles);

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

const CavaticaFileSummary = ({ state, theme, showDetails, setShowDetails }) => {
  const showUnauth = !!(state.unauthorizedFiles && state.unauthorizedFiles.length > 0);
  const showAuth =
    state.authorizedFiles !== null && (state.authorizedFilesCombined.length > 0 || showUnauth);
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
                  <span className="number">{state.authorizedFilesCombined.length}</span>
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
        {showUnauth && state.fileStudyData && (
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
                />
                Close Details
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
                />
                File Details
              </div>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default enhance(CavaticaFileSummary);
