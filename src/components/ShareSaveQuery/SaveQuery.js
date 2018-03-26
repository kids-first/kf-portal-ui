import React from 'react';
import Component from 'react-component-component';
import { injectState } from 'freactal';
import { Route } from 'react-router-dom';
import urlJoin from 'url-join';
import Spinner from 'react-spinkit';
import SaveIcon from 'react-icons/lib/fa/floppy-o';
import Tooltip from 'uikit/Tooltip';
import Heading from 'uikit/Heading';
import NiceWhiteButton from 'uikit/NiceWhiteButton';
import theme from 'theme/defaultTheme';
import { ModalFooter } from 'components/Modal';
import { arrangerApiAbsolutePath } from 'common/injectGlobals';
import sqonToName from 'common/sqonToName';
import shortenApi from './shortenApi';

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
      let { stats, sqon, state: { loggedInUser } } = this.props;
      this.setState({ loading: true });
      shortenApi({ stats, sqon, queryName: this.state.queryName, loggedInUser })
        .then(data => {
          this.setState({
            loading: false,
            link: urlJoin(arrangerApiAbsolutePath, 's', data.body.shortUrl),
          });
        })
        .catch(error => {
          this.setState({ error: true, loading: false });
        });
    };

    render() {
      const { className = '' } = this.props;
      return (
        !!this.props.state.loggedInUser && (
          <div
            css={`
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 10px;
              background-color: aliceblue;
              border: 1px solid #d6d6d6;
              ${className};
            `}
          >
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
                                Query saved succesfully!
                              </div>
                              <div onClick={() => history.push('/dashboard')}>
                                <NiceWhiteButton
                                  css={`
                                    margin: 0 auto;
                                    padding: 10px 15px;
                                  `}
                                >
                                  View in My Saved Queries
                                </NiceWhiteButton>
                              </div>
                            </div>
                            <Heading
                              css={`
                                border-bottom: 1px solid ${theme.greyScale4};
                                padding: 7px;
                                display: flex;
                                align-items: center;
                              `}
                            >
                              Save Query
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
                            <div
                              css={`
                                padding: 0 9px;
                                font-style: italic;
                                color: ${theme.greyScale2};
                              `}
                            >
                              Save the current configuration of filters
                            </div>
                            <div
                              css={`
                                font-weight: bold;
                                margin-top: 10px;
                                padding: 0 9px;
                                color: ${theme.greyScale2};
                              `}
                            >
                              Enter a name for your saved query:
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
                    <SaveIcon />&nbsp;save
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
