import React from 'react';
import {
  cardContent,
  cardScrollY,
  cardFader,
  scrollable as scrollableCss,
  visible,
  cardScrollYFullHeight,
} from './Card.module.css';
import PropTypes from 'prop-types';

const isScrolledToBottom = (domElement) => {
  const { scrollTop, scrollHeight, offsetHeight } = domElement;
  return scrollTop + offsetHeight >= scrollHeight;
};

class CardContent extends React.Component {
  static propTypes = {
    scrollable: PropTypes.bool,
    showsContentFader: PropTypes.bool,
    className: PropTypes.string,
    showScrollFullHeight: PropTypes.bool,
    children: PropTypes.any,
  };

  state = { isAtBottom: !this.props.scrollable };

  handleScroll = (evt) =>
    this.setState({
      isAtBottom: isScrolledToBottom(evt.currentTarget),
    });

  render() {
    const {
      children,
      scrollable = false,
      showsContentFader = true,
      className = '',
      showScrollFullHeight = false,
    } = this.props;

    return (
      <div className={`${cardContent} ${className}`}>
        <div
          onScroll={this.handleScroll}
          className={`${showScrollFullHeight ? cardScrollYFullHeight : cardScrollY} ${
            scrollable ? scrollableCss : ''
          }`}
        >
          {children}
        </div>
        <div
          className={`${cardFader} ${
            scrollable && showsContentFader && !this.state.isAtBottom ? visible : ''
          }`}
        />
      </div>
    );
  }
}

export default CardContent;
