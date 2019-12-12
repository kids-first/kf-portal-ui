import * as React from 'react';
import { truncate } from 'lodash';

import PlusIcon from 'icons/PlusCircleIcon';
import CheckIcon from 'icons/CircleCheckIcon';
import SlashIcon from 'icons/CircleSlashIcon';
import Spinner from 'react-spinkit';
import theme from 'theme/defaultTheme';

import './cavatica.css';
import './CavaticaFileSummary.css';

class CavaticaFileSummary extends React.Component {
  state = {
    showDetails: false,
  };
  render() {
    const {
      unauthorizedFiles,
      authorizedFiles,
      fileAuthInitialized,
      authorizedFilesCombined,
      fileStudyData,
    } = this.props;

    const { showDetails } = this.state;

    const showUnauth = Boolean(unauthorizedFiles) && unauthorizedFiles.length > 0;
    const showAuth = Boolean(authorizedFiles) && (authorizedFilesCombined.length > 0 || showUnauth);
    return (
      <div>
        <span className="cavatica-modalHeader">File Summary:</span>
        <div className="cssFileSummaryRoot">
          <div className="filePermissions">
            {!fileAuthInitialized && (
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
                    <span className="number">{authorizedFilesCombined.length}</span>
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
                      <span className="number">{unauthorizedFiles.length}</span>
                      <span className="text">Files</span>
                    </div>
                  </div>
                )}
              </div>
            )}
            {showDetails && (
              <div className="details">
                <div className="left block">
                  {fileStudyData.authorized &&
                    fileStudyData.authorized.map(study => (
                      <div className="studyDetails">
                        <div className="studyName">
                          {truncate(fileStudyData.names[study.id], {
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
                  {fileStudyData.unauthorized &&
                    fileStudyData.unauthorized.map(study => (
                      <div className="studyDetails">
                        <div className="studyName">
                          {truncate(fileStudyData.names[study.id], {
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
          {showUnauth && fileStudyData && (
            <button
              className="showDetailsButton"
              onClick={() => {
                this.setState({
                  showDetails: !showDetails,
                });
              }}
            >
              {showDetails ? (
                <div>
                  <PlusIcon
                    width={10}
                    height={10}
                    style={{
                      fill: theme.primary,
                      marginTop: '1px',
                      marginRight: '4px',
                    }}
                  />
                  Close Details
                </div>
              ) : (
                <div>
                  <PlusIcon
                    width={10}
                    height={10}
                    style={{
                      fill: theme.primary,
                      marginTop: '1px',
                      marginRight: '4px',
                    }}
                  />
                  File Details
                </div>
              )}
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default CavaticaFileSummary;
