import React from 'react';
import PropTypes from 'prop-types';
import ShareIcon from 'react-icons/lib/fa/share-alt';
import ChainIcon from 'react-icons/lib/fa/chain';
import FBIcon from 'react-icons/lib/fa/facebook';
import TwitterIcon from 'react-icons/lib/fa/twitter';
import LIIcon from 'react-icons/lib/fa/linkedin';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton } from 'react-share';
import Tooltip from 'uikit/Tooltip';
import { WhiteButton } from 'uikit/Button';
import styled from 'react-emotion';
import Row from 'uikit/Row';

import { flexCenter } from '../theme/tempTheme.module.css';

const track = (channel, trackingFunc) => trackingFunc(channel);

const ButtonContainer = ({ children }) => (
  <Row className={flexCenter} style={{ padding: '10px 5px' }}>
    {children}
  </Row>
);

const Bubble = styled(`span`)`
  background-color: ${({ theme }) => theme.primary};
  color: white;
  padding: 4px 6px;
  border-radius: 100%;
  margin-right: 10px;
`;

const ItemRow = styled('div')`
  padding: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.greyScale6};
  }
`;

const Button = styled(WhiteButton)`
  padding: 6px 10px;
`;

class ShareButton extends React.Component {
  state = { copied: false, open: false };

  render() {
    const { link, trackShare = x => x, disabled } = this.props;
    return (
      <ButtonContainer>
        <Button
          disabled={disabled}
          onClick={
            disabled
              ? () => {}
              : () => {
                  this.setState({ open: true });
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
                <React.Fragment>
                  <ItemRow>
                    <CopyToClipboard
                      text={link}
                      onCopy={() => {
                        this.setState({ copied: true });
                        track('copied', trackShare);
                      }}
                    >
                      <span>
                        <Bubble>
                          <ChainIcon />
                        </Bubble>
                        <span>{this.state.copied ? 'Copied!' : 'copy URL'}</span>
                      </span>
                    </CopyToClipboard>
                  </ItemRow>
                  <ItemRow onClick={() => track('Facebook', trackShare)}>
                    <FacebookShareButton url={link} quote="Kids First File Repo Query">
                      <Bubble>
                        <FBIcon />
                      </Bubble>
                      share on facebook
                    </FacebookShareButton>
                  </ItemRow>
                  <ItemRow onClick={() => track('Twitter', trackShare)}>
                    <Bubble>
                      <TwitterIcon />
                    </Bubble>
                    <TwitterShareButton title="Kids First File Repo Query" url={link}>
                      share on twitter
                    </TwitterShareButton>
                  </ItemRow>
                  <ItemRow onClick={() => track('LinkedIn', trackShare)}>
                    <LinkedinShareButton title="Kids First File Repo Query" url={link}>
                      <Bubble>
                        <LIIcon />
                      </Bubble>
                      share on linkedin
                    </LinkedinShareButton>
                  </ItemRow>
                </React.Fragment>
              </div>
            }
          >
            <ShareIcon />
            &nbsp;share
          </Tooltip>
        </Button>
      </ButtonContainer>
    );
  }
}

ShareButton.propTypes = {
  link: PropTypes.string.isRequired,
};

export default ShareButton;
