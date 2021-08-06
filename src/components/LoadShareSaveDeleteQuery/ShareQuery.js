import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ChainIcon from 'react-icons/lib/fa/chain';
import FBIcon from 'react-icons/lib/fa/facebook';
import LIIcon from 'react-icons/lib/fa/linkedin';
import TwitterIcon from 'react-icons/lib/fa/twitter';
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton } from 'react-share';
import { ShareAltOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import urlJoin from 'url-join';

import { shortUrlResolveRoot } from 'common/injectGlobals';
import { styleComponent } from 'components/Utils';
import { TRACKING_EVENTS, trackUserInteraction } from 'services/analyticsTracking';
import { withApi } from 'services/api';
import { Spinner } from 'uikit/Spinner';
import Tooltip from 'uikit/Tooltip';

import shortenApi from './shortenApi';

import './LoadShareSaveDeleteQuery.css';

const trackQueryShare = async (channel) => {
  await trackUserInteraction({
    category: TRACKING_EVENTS.categories.fileRepo.dataTable,
    action: TRACKING_EVENTS.actions.query.share,
    label: channel,
  });
};

const Bubble = styleComponent('span', 'query-bubble');
const ItemRow = styleComponent('div', 'query-item-row');

class ShareQuery extends React.Component {
  static propTypes = {
    stats: PropTypes.object,
    sqon: PropTypes.object,
    api: PropTypes.func.isRequired,
    getSharableUrl: PropTypes.func,
    handleShare: PropTypes.func,
    user: PropTypes.object,
    disabled: PropTypes.bool,
  };

  state = { link: null, copied: false, error: null, open: false };

  share = async () => {
    const { stats, sqon, api, getSharableUrl, handleShare, user } = this.props;
    try {
      const data = await (handleShare
        ? handleShare()
        : shortenApi({ stats, sqon, user, api, sharedPublicly: true }));
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
      <Button
        icon={<ShareAltOutlined />}
        disabled={disabled}
        onClick={
          disabled
            ? () => {}
            : async () => {
                this.setState({ open: true });
                await this.share();
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
                <>
                  {this.state.error ? (
                    <ItemRow style={{ justifyContent: 'center' }}>
                      {'Sorry something went wrong.'}
                    </ItemRow>
                  ) : (
                    <ItemRow style={{ justifyContent: 'center', height: '25px' }}>
                      <Spinner size={'small'} />
                    </ItemRow>
                  )}
                </>
              ) : (
                <React.Fragment>
                  <ItemRow>
                    <CopyToClipboard
                      text={this.state.link}
                      onCopy={async () => {
                        this.setState({ copied: true });
                        await trackQueryShare('copied');
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
                      quote={
                        'Kids First Data Resource Portal: ' +
                        'sharing data to enable researchers, clinicians, and patients' +
                        ' to collaborate and accelerate pediatric cancer' +
                        ' and structural birth defects research.'
                      }
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
                      title={
                        'Kids First Data Resource Portal: ' +
                        'sharing data to enable researchers, clinicians, and patients to collaborate and ' +
                        'accelerate pediatric cancer and structural birth defects research.'
                      }
                      url={this.state.link}
                    >
                      share on twitter
                    </TwitterShareButton>
                  </ItemRow>
                  <ItemRow onClick={() => trackQueryShare('LinkedIn')}>
                    <LinkedinShareButton
                      title={
                        'Kids First Data Resource Portal: ' +
                        'sharing data to enable researchers, clinicians, and patients to collaborate and ' +
                        'accelerate pediatric cancer and structural birth defects research.'
                      }
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
          &nbsp;share
        </Tooltip>
      </Button>
    );
  }
}

export default compose(withApi)(ShareQuery);
