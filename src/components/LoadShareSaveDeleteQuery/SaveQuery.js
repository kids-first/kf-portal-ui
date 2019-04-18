import React from 'react';
import Component from 'react-component-component';
import { injectState } from 'freactal';
import { Route } from 'react-router-dom';
import urlJoin from 'url-join';
import Spinner from 'react-spinkit';
import SaveIcon from 'react-icons/lib/fa/floppy-o';
import Tooltip from 'uikit/Tooltip';
import NiceWhiteButton from 'uikit/NiceWhiteButton';
import theme from 'theme/defaultTheme';
import { ModalFooter } from 'components/Modal';
import { arrangerApiRoot } from 'common/injectGlobals';
import sqonToName from 'common/sqonToName';
import shortenApi from './shortenApi';
import { Trans } from 'react-i18next';
import { SaveQueryHeading } from './ui';
import { WhiteButton } from 'uikit/Button';

import { trackUserInteraction, TRACKING_EVENTS } from '../../services/analyticsTracking';

export default injectState(
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
      let {
        stats,
        sqon,
        api,
        state: { loggedInUser },
      } = this.props;
      this.setState({ loading: true });
      shortenApi({
        stats,
        sqon,
        queryName: this.state.queryName,
        loggedInUser,
        api,
        sharedPublicly: false,
      })
        .then(data => {
          this.setState({
            loading: false,
            link: urlJoin(arrangerApiRoot, 's', data.id),
          });
          const trackingSqon = { ...sqon, id: data.id };
          let savedQueryInteraction = {
            category: TRACKING_EVENTS.categories.fileRepo.dataTable,
            action: TRACKING_EVENTS.actions.query.save,
            label: JSON.stringify(trackingSqon),
          };
          trackUserInteraction(savedQueryInteraction);
        })
        .catch(error => {
          this.setState({ error: true, loading: false });
          trackUserInteraction({
            category: TRACKING_EVENTS.categories.fileRepo.dataTable,
            action: TRACKING_EVENTS.actions.query.save + ' FAILED',
          });
        });
    };

    render() {
      const { disabled } = this.props;
      return (
        !!this.props.state.loggedInUser && (
          <WhiteButton
            disabled={disabled}
            onClick={() =>
              !disabled &&
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
                        <div
                          css={`
                            position: relative;
                            height: 225px;
                          `}
                        >
                          <div
                            css={`
                              transform: translateX(-100%);
                              transition: transform 0.3s ease;
                              color: red;
                              position: absolute;
                              color: red;
                              width: 100%;
                              height: 100%;
                              background-color: #00afee;
                              z-index: 1;
                              text-align: center;
                            `}
                            style={{
                              ...(state.saved && this.state.link
                                ? { transform: 'translateX(0%)' }
                                : {}),
                            }}
                          >
                            <div
                              css={`
                                color: white;
                                font-size: 20px;
                                padding: 20px;
                                font-weight: bold;
                              `}
                            >
                              <Trans>Query saved succesfully!</Trans>
                            </div>
                            <div
                              onClick={() => {
                                trackUserInteraction({
                                  category: TRACKING_EVENTS.categories.fileRepo.dataTable,
                                  action: 'View in My Saved Queries',
                                });
                                history.push('/dashboard');
                              }}
                            >
                              <NiceWhiteButton
                                css={`
                                  margin: 0 auto;
                                  padding: 10px 15px;
                                `}
                              >
                                <Trans>View in My Saved Queries</Trans>
                              </NiceWhiteButton>
                            </div>
                          </div>
                          <SaveQueryHeading>
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
                          </SaveQueryHeading>
                          <div
                            css={`
                              padding: 0 9px;
                              font-style: italic;
                              color: ${theme.greyScale2};
                            `}
                          >
                            <Trans>Save the current configuration of filters</Trans>
                          </div>
                          <div
                            css={`
                              font-weight: bold;
                              margin-top: 10px;
                              padding: 0 9px;
                              color: ${theme.greyScale2};
                            `}
                          >
                            <Trans>Enter a name for your saved query:</Trans>
                          </div>
                          <div
                            css={`
                              margin-bottom: 85px;
                            `}
                          >
                            <input
                              css={`
                                border-radius: 10px;
                                background-color: #ffffff;
                                border: solid 1px #cacbcf;
                                padding: 5px;
                                font-size: 1em;
                                margin: 10px;
                                margin-bottom: 0px;
                                width: calc(100% - 30px);
                              `}
                              type="text"
                              value={this.state.queryName}
                              ref={input => {
                                this.input = input;
                              }}
                              onChange={e => this.setState({ queryName: e.target.value })}
                            />
                          </div>
                          <ModalFooter
                            handleSubmit={() => setState({ saved: true }, this.save)}
                            handleCancelClick={() => this.setState({ open: false })}
                          />
                        </div>
                      )}
                    />
                  }
                >
                  <SaveIcon />
                  &nbsp;<Trans>Save</Trans>
                </Tooltip>
              )}
            </Route>
          </WhiteButton>
        )
      );
    }
  },
);
