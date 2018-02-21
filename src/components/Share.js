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
        'og:title': 'Kids First File Repo',
        'og:description': 'lorem ipsum',
        'og:image':
          'https://d3b.center/wp-content/uploads/2018/01/Kids-First-Hero-image-01-2-2000x500.png',
        'twitter:label1': 'Test Label',
        'twitter:data1': 'test data',
      }),
    })
      .then(r => r.json())
      .then(data => {
        this.setState({
          link: `${process.env.REACT_APP_ARRANGER_API}/s/${data.body.shortUrl}`,
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
