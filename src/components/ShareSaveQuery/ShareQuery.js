import React from 'react';
import { injectState } from 'freactal';
import urlJoin from 'url-join';
import Spinner from 'react-spinkit';
import ShareIcon from 'react-icons/lib/fa/share-alt';
import ChainIcon from 'react-icons/lib/fa/chain';
import FBIcon from 'react-icons/lib/fa/facebook';
import TwitterIcon from 'react-icons/lib/fa/twitter';
import LIIcon from 'react-icons/lib/fa/linkedin';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton } from 'react-share';
import Tooltip from 'uikit/Tooltip';
import { arrangerApiAbsolutePath, shortUrlApi } from 'common/injectGlobals';

let Bubble = p => (
  <span
    css={`
      background-color: purple;
      color: white;
      padding: 4px 6px;
      border-radius: 100%;
      margin-right: 10px;
    `}
    {...p}
  />
);

let ItemRow = ({ xcss = '', ...props }) => (
  <div
    css={`
      padding: 10px;
      display: flex;
      align-items: center;
      cursor: pointer;
      &:hover {
        background-color: rgb(240, 240, 240);
      }
      ${xcss};
    `}
    {...props}
  />
);

export default injectState(
  class extends React.Component {
    state = { link: null, copied: false, error: null };

    share = () => {
      // TODO: user / token stuff
      let { Files, Participants, Families, Size } = this.props.stats;
      // TODO: use ajax service?
      fetch(urlJoin(shortUrlApi, 'shorten'), {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          userid: 'dev',
          alias: 'TODO: create generic alias from SQON gdc setname style',
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
        })
        .catch(error => {
          this.setState({ error: true });
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
          <div id="share" className="sqon-bubble sqon-clear" onClick={this.share}>
            <Tooltip
              position="bottom"
              trigger="click"
              interactive
              html={
                <div
                  css={`
                    width: 200px;
                  `}
                >
                  {!this.state.link ? (
                    <ItemRow
                      xcss={`
                        justify-content: center;
                      `}
                    >
                      {this.state.error ? (
                        'Sorry something went wrong.'
                      ) : (
                        <Spinner
                          fadeIn="none"
                          name="circle"
                          color="purple"
                          style={{
                            width: 15,
                            height: 15,
                            marginRight: 9,
                          }}
                        />
                      )}
                    </ItemRow>
                  ) : (
                    <React.Fragment>
                      <ItemRow>
                        <CopyToClipboard
                          text={this.state.link}
                          onCopy={() => this.setState({ copied: true })}
                        >
                          <span>
                            <Bubble>
                              <ChainIcon />
                            </Bubble>
                            <span>{this.state.copied ? 'Copied!' : 'copy short URL'}</span>
                          </span>
                        </CopyToClipboard>
                      </ItemRow>
                      <ItemRow>
                        <FacebookShareButton
                          url={this.state.link}
                          quote="Kids First File Repo Query"
                        >
                          <Bubble>
                            <FBIcon />
                          </Bubble>share on facebook
                        </FacebookShareButton>
                      </ItemRow>
                      <ItemRow>
                        <Bubble>
                          <TwitterIcon />
                        </Bubble>
                        <TwitterShareButton
                          title="Kids First File Repo Query"
                          url={this.state.link}
                        >
                          share on twitter
                        </TwitterShareButton>
                      </ItemRow>
                      <ItemRow>
                        <LinkedinShareButton
                          title="Kids First File Repo Query"
                          url={this.state.link}
                        >
                          <Bubble>
                            <LIIcon />
                          </Bubble>share on linkedin
                        </LinkedinShareButton>
                      </ItemRow>
                    </React.Fragment>
                  )}
                </div>
              }
            >
              <ShareIcon />&nbsp;share
            </Tooltip>
          </div>
        </div>
      );
    }
  },
);
