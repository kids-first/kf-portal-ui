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
import { WhiteButton } from 'uikit/Button';
import { shortUrlResolveRoot } from 'common/injectGlobals';
import shortenApi from './shortenApi';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import { styleComponent } from 'components/Utils';

import './LoadShareSaveDeleteQuery.css';

const trackQueryShare = channel => {
  trackUserInteraction({
    category: TRACKING_EVENTS.categories.fileRepo.dataTable,
    action: TRACKING_EVENTS.actions.query.share,
    label: channel,
  });
};

const Bubble = styleComponent('span', 'query-bubble');
const ItemRow = styleComponent('div', 'query-item-row');

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
              <div style={{ width: '200px' }}>
                {!this.state.link ? (
                  <ItemRow style={{ justifyContent: 'center' }}>
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
                        onCopy={() => {
                          this.setState({ copied: true });
                          trackQueryShare('copied');
                        }}
                      >
                        <span>
                          <Bubble>
                            <ChainIcon />
                          </Bubble>
                          <span>{this.state.copied ? 'Copied!' : 'copy short URL'}</span>
                        </span>
                      </CopyToClipboard>
                    </ItemRow>
                    <ItemRow onClick={() => trackQueryShare('Facebook')}>
                      <FacebookShareButton
                        url={this.state.link}
                        quote="Kids First Data Resource Portal: sharing data to enable researchers, clinicians, and patients to collaborate and accelerate pediatric cancer and structural birth defects research."
                      >
                        <Bubble>
                          <FBIcon />
                        </Bubble>
                        share on facebook
                      </FacebookShareButton>
                    </ItemRow>
                    <ItemRow onClick={() => trackQueryShare('Twitter')}>
                      <Bubble>
                        <TwitterIcon />
                      </Bubble>
                      <TwitterShareButton
                        title="Kids First Data Resource Portal: sharing data to enable researchers, clinicians, and patients to collaborate and accelerate pediatric cancer and structural birth defects research."
                        url={this.state.link}
                      >
                        share on twitter
                      </TwitterShareButton>
                    </ItemRow>
                    <ItemRow onClick={() => trackQueryShare('LinkedIn')}>
                      <LinkedinShareButton
                        title="Kids First Data Resource Portal: sharing data to enable researchers, clinicians, and patients to collaborate and accelerate pediatric cancer and structural birth defects research."
                        url={this.state.link}
                      >
                        <Bubble>
                          <LIIcon />
                        </Bubble>
                        share on linkedin
                      </LinkedinShareButton>
                    </ItemRow>
                  </React.Fragment>
                )}
              </div>
            }
          >
            <ShareIcon style={{ marginTop: '-2px' }} />
            &nbsp;share
          </Tooltip>
        </WhiteButton>
      );
    }
  },
);
