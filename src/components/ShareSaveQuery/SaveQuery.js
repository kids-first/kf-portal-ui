import React from 'react';
import { injectState } from 'freactal';
import SaveIcon from 'react-icons/lib/fa/floppy-o';
import Tooltip from 'uikit/Tooltip';

export default injectState(
  class extends React.Component {
    state = { link: null, copied: false, queryName: '' };

    share = () => {
      console.log(this.props.state); // TODO: user / token stuff
      let { Files, Participants, Families, Size } = this.props.stats;
      fetch('https://13gqusdt40.execute-api.us-east-1.amazonaws.com/Dev/shorten', {
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
          <div id="share" className="sqon-bubble sqon-clear">
            <Tooltip
              position="bottom"
              trigger="click"
              interactive
              html={
                <span>
                  <div>Save Query</div>
                  <div>Save the current configuration of filters</div>
                  <div>Enter a name for your saved query:</div>
                  <div>
                    <input
                      type="text"
                      value={this.state.queryName}
                      onChange={e => this.setState({ queryName: e.target.value })}
                    />
                  </div>
                  <div>
                    <div>Cancel</div>
                    <div onClick={this.share}>OK</div>
                  </div>
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
