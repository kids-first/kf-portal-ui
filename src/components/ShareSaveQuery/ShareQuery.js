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
import { shortUrlResolveRoot } from 'common/injectGlobals';
import shortenApi from './shortenApi';
import { Trans } from 'react-i18next';
import { trackUserInteraction, TRACKING_EVENTS } from '../../services/analyticsTracking';
import { WhiteButton } from 'uikit/Button';
import styled from 'react-emotion';

const trackQueryShare = channel => {
  trackUserInteraction({
    category: TRACKING_EVENTS.categories.fileRepo.dataTable,
    action: TRACKING_EVENTS.actions.query.share,
    label: channel,
  });
};

let Bubble = styled(`span`)`
  background-color: ${({ theme }) => theme.primary};
  color: white;
  padding: 4px 6px;
  border-radius: 100%;
  margin-right: 10px;
`;

let ItemRow = styled('div')`
  padding: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.greyScale6};
  }
`;

export default injectState(
  class extends React.Component {
    state = { link: null, copied: false, error: null, open: false };

    share = async () => {
      let {
        stats,
        sqon,
        api,
        state: { loggedInUser },
        getSharableUrl,
        handleShare,
      } = this.props;
      try {
        const data = await (handleShare
          ? handleShare()
          : shortenApi({ stats, sqon, loggedInUser, api, sharedPublicly: true }));
        this.setState({
          link: getSharableUrl
            ? getSharableUrl({ id: data.id })
            : urlJoin(shortUrlResolveRoot, data.id),
        });
      } catch (error) {
        this.setState({ error: true });
      }
    };

    render() {
      const { disabled } = this.props;
      return (
        <WhiteButton
          disabled={disabled}
          onClick={
            disabled
              ? () => {}
              : () => {
                  this.setState({ open: true });
                  this.share();
                }
          }
        >
          <Tooltip
            position="bottom"
            open={this.state.open}
            onRequestClose={() => {
              this.setState({ open: false });
              // after fadeout transition finishes, clear copy state
              setTimeout(() => this.setState({ copied: false }), 1000);
            }}
            interactive
            html={
              <div
                css={`
                  width: 200px;
                `}
              >
                {!this.state.link ? (
                  <ItemRow
                    css={`
                      justify-content: center;
                    `}
                  >
                    {this.state.error ? (
                      <Trans>Sorry something went wrong.</Trans>
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
                        onCopy={() => {
                          this.setState({ copied: true });
                          trackQueryShare('copied');
                        }}
                      >
                        <span>
                          <Bubble>
                            <ChainIcon />
                          </Bubble>
                          <span>
                            {this.state.copied ? (
                              <Trans>Copied!</Trans>
                            ) : (
                              <Trans>copy short URL</Trans>
                            )}
                          </span>
                        </span>
                      </CopyToClipboard>
                    </ItemRow>
                    <ItemRow onClick={() => trackQueryShare('Facebook')}>
                      <FacebookShareButton url={this.state.link} quote="Kids First File Repo Query">
                        <Bubble>
                          <FBIcon />
                        </Bubble>
                        <Trans>share on facebook</Trans>
                      </FacebookShareButton>
                    </ItemRow>
                    <ItemRow onClick={() => trackQueryShare('Twitter')}>
                      <Bubble>
                        <TwitterIcon />
                      </Bubble>
                      <TwitterShareButton title="Kids First File Repo Query" url={this.state.link}>
                        <Trans>share on twitter</Trans>
                      </TwitterShareButton>
                    </ItemRow>
                    <ItemRow onClick={() => trackQueryShare('LinkedIn')}>
                      <LinkedinShareButton title="Kids First File Repo Query" url={this.state.link}>
                        <Bubble>
                          <LIIcon />
                        </Bubble>
                        <Trans>share on linkedin</Trans>
                      </LinkedinShareButton>
                    </ItemRow>
                  </React.Fragment>
                )}
              </div>
            }
          >
            <ShareIcon />
            &nbsp;<Trans>share</Trans>
          </Tooltip>
        </WhiteButton>
      );
    }
  },
);
