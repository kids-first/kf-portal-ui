import React from 'react';

import { cardContent, cardScrollY, cardFader } from './Card.module.css';

const isScrolledToBottom = domElement => {
  const { scrollTop, scrollHeight, offsetHeight } = domElement;
  return scrollTop + offsetHeight >= scrollHeight;
};

class CardContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isAtBottom: !props.scrollable };
    this.handleScroll = this.handleScroll.bind(this);
  }

  handleScroll(evt) {
    this.setState({
      isAtBottom: isScrolledToBottom(evt.currentTarget),
    });
  }

  render() {
    const { children, scrollable = false, showsContentFader = true, className = '' } = this.props;
    return (
      <div className={`${cardContent} ${className}`}>
        <div
          onScroll={this.handleScroll}
          className={`${cardScrollY} ${scrollable ? 'scrollable' : ''}`}
        >
          {children}
        </div>
        <div
          className={`${cardFader} ${
            scrollable && showsContentFader && !this.state.isAtBottom ? 'visible' : ''
          }`}
        />
      </div>
    );
  }
}

export default CardContent;
