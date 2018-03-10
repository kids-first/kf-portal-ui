import React from 'react';
import { injectState } from 'freactal';
import urlJoin from 'url-join';
import SaveIcon from 'react-icons/lib/fa/floppy-o';
import Tooltip from 'uikit/Tooltip';
import Heading from 'uikit/Heading';
import theme from 'theme/defaultTheme';
import { ModalFooter } from 'components/Modal';
import { arrangerApiAbsolutePath, shortUrlApi } from 'common/injectGlobals';

export default injectState(
  class extends React.Component {
    state = { link: null, queryName: '', open: false };

    share = () => {
      let { Files, Participants, Families, Size } = this.props.stats;
      fetch(urlJoin(shortUrlApi, 'shorten'), {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          userid: 'dev',
          alias: this.state.queryName,
          content: {
            ...this.props.stats,
            longUrl: window.location.href,
            'og:title': 'Kids First File Repository',
            'og:description': `${Files} Files, ${Participants} Participants, ${Families} Families, ${Size} Size`,
            'og:image':
              'https://d3b.center/wp-content/uploads/2018/01/Kids-First-Hero-image-01-2-2000x500.png',
            'twitter:label1': 'Test Label',
            'twitter:data1': 'test data',
          },
        }),
      })
        .then(r => r.json())
        .then(data => {
          this.setState({
            link: urlJoin(arrangerApiAbsolutePath, 's', data.body.shortUrl),
          });
        });
    };

    render() {
      return (
        <div
          css={`
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 10px;
            background-color: aliceblue;
            border: 1px solid #d6d6d6;
          `}
        >
          <div
            id="share"
            className="sqon-bubble sqon-clear"
            onClick={() => this.setState({ open: true })}
          >
            <Tooltip
              position="bottom"
              onRequestClose={() => this.setState({ open: false })}
              interactive
              open={this.state.open}
              html={
                <span>
                  <Heading
                    css={`
                      border-bottom: 1px solid ${theme.greyScale4};
                      padding: 7px;
                    `}
                  >
                    Save Query
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
                      onChange={e => this.setState({ queryName: e.target.value })}
                    />
                  </div>
                  <ModalFooter handleCancelClick={() => this.setState({ open: false })} />
                </span>
              }
            >
              <SaveIcon />&nbsp;save
            </Tooltip>
          </div>
        </div>
      );
    }
  },
);
