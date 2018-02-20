import React from 'react';
import ToolTip from 'react-portal-tooltip';
import ShareIcon from 'react-icons/lib/fa/share-alt';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export default class extends React.Component {
  state = { open: false, link: null, copied: false };

  share = () => {
    this.setState({ open: true });
    fetch('https://13gqusdt40.execute-api.us-east-1.amazonaws.com/Dev/shorten', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        userid: 'dev',
        content: window.location.href,
      }),
    })
      .then(r => r.json())
      .then(data => {
        this.setState({
          link: `${window.location.origin}/s/${data.body.shortUrl}`,
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
        <div id="share" className="sqon-bubble sqon-clear" onClick={this.share}>
          <ShareIcon />&nbsp;share
        </div>
        <ToolTip active={this.state.open} position="bottom" arrow="center" parent="#share">
          <CopyToClipboard text={this.state.link} onCopy={() => this.setState({ copied: true })}>
            <span>{this.state.copied ? 'Copied!' : 'copy short URL'}</span>
          </CopyToClipboard>
          <div>share on facebook</div>
          <div>share on twitter</div>
          <div>share on linkedin</div>
        </ToolTip>
      </div>
    );
  }
}
