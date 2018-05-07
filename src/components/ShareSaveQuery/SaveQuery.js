import React from 'react';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';
import Component from 'react-component-component';
import { injectState } from 'freactal';
import { Route } from 'react-router-dom';
import urlJoin from 'url-join';
import Spinner from 'react-spinkit';
import SaveIcon from 'react-icons/lib/fa/floppy-o';
import Tooltip from 'uikit/Tooltip';
import Heading from 'uikit/Heading';
import NiceWhiteButton from 'uikit/NiceWhiteButton';
import { ModalFooter } from 'components/Modal';
import { arrangerApiAbsolutePath } from 'common/injectGlobals';
import sqonToName from 'common/sqonToName';
import shortenApi from './shortenApi';
import { Trans } from 'react-i18next';

export default compose(injectState, withTheme)(
  class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        link: null,
        loading: false,
        queryName: sqonToName({ filters: this.props.sqon }),
        open: false,
      };
    }

    componentWillReceiveProps(next) {
      if (next.sqon !== this.props.sqon) {
        this.setState({ queryName: sqonToName({ filters: next.sqon }) });
      }
    }

    save = () => {
      let { stats, sqon, api, state: { loggedInUser } } = this.props;
      this.setState({ loading: true });
      shortenApi({ stats, sqon, queryName: this.state.queryName, loggedInUser, api })
        .then(data => {
          this.setState({
            loading: false,
            link: urlJoin(arrangerApiAbsolutePath, 's', data.id),
          });
        })
        .catch(error => {
          this.setState({ error: true, loading: false });
        });
    };

    render() {
      const { className = '', theme } = this.props;
      return (
        !!this.props.state.loggedInUser && (
          <div className={`${theme.saveQuery()} ${className}`}>
            <div
              id="save"
              className="sqon-bubble sqon-clear"
              onClick={() =>
                this.setState({ open: true }, () => {
                  // so hacky, but couldn't get any reasonable approach to work
                  let id = setInterval(() => {
                    if (this.input) {
                      this.input.focus();
                      clearInterval(id);
                    }
                  });
                })
              }
            >
              <Route>
                {({ history }) => (
                  <Tooltip
                    position="bottom"
                    onRequestClose={() => {
                      this.setState({ open: false, link: null });
                    }}
                    interactive
                    open={this.state.open}
                    html={
                      <Component
                        initialState={{ saved: false }}
                        render={({ state, setState }) => (
                          <div className={theme.saveQueryTooltipContent(theme)}>
                            <div
                              className={`successSlideIn ${
                                state.saved && this.state.link ? 'shown' : ''
                              }`}
                            >
                              <div className={`slideInContent`}>
                                <Trans>Query saved succesfully!</Trans>
                              </div>
                              <div onClick={() => history.push('/dashboard')}>
                                <NiceWhiteButton>
                                  <Trans>View in My Saved Queries</Trans>
                                </NiceWhiteButton>
                              </div>
                            </div>
                            <Heading>
                              <Trans>Save Query</Trans>
                              {this.state.loading && (
                                <Spinner
                                  fadeIn="none"
                                  name="circle"
                                  color="purple"
                                  style={{
                                    width: 15,
                                    height: 15,
                                    marginRight: 9,
                                    marginLeft: 'auto',
                                  }}
                                />
                              )}
                            </Heading>
                            <div className={`explanation`}>
                              <Trans>Save the current configuration of filters</Trans>
                            </div>
                            <div className={`queryNamePrompt`}>
                              <Trans>Enter a name for your saved query:</Trans>
                            </div>
                            <input
                              className={`queryNameInput`}
                              type="text"
                              value={this.state.queryName}
                              ref={input => {
                                this.input = input;
                              }}
                              onChange={e => this.setState({ queryName: e.target.value })}
                            />
                            <ModalFooter
                              handleSubmit={() => setState({ saved: true }, this.save)}
                              handleCancelClick={() => this.setState({ open: false })}
                            />
                          </div>
                        )}
                      />
                    }
                  >
                    <SaveIcon />&nbsp;<Trans>Save</Trans>
                  </Tooltip>
                )}
              </Route>
            </div>
          </div>
        )
      );
    }
  },
);
