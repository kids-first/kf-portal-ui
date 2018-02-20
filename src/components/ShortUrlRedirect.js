import React from 'react';

export default class extends React.Component {
  constructor(props) {
    super();
    this.state = { target: null };
    fetch(
      `https://13gqusdt40.execute-api.us-east-1.amazonaws.com/Dev/${props.match.params.shortUrl}`,
    )
      .then(r => r.json())
      .then(data => {
        window.location.href = data.value;
      });
  }
  render() {
    return null;
  }
}
