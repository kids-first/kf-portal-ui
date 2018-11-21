import React from 'react';
import Slider from 'react-slick';

import CardContent from 'uikit/Card/CardContent';
import CardHeader from 'uikit/Card/CardHeader';
import { CardWrapper } from 'uikit/Card/styles';
import './slick/slick.css';

const settings = {
  infinite: true,
  speed: 250,
  slidesToShow: 1,
  slidesToScroll: 1,
  customPaging: i => <div />,
  nextArrow: <div />,
  previousArrow: <div />,
  dots: false,
  autoplay: true,
};

const MultiCard = ({
  Header,
  Content = CardContent,
  children,
  className,
  scrollable,
  title,
  stackIndex,
  setStack,
}) => {
  return (
    <CardWrapper className={className}>
      {Header || <CardHeader title={title} />}
      <Content scrollable={scrollable}>
        <Slider {...settings}>
          <div>
            <h3>1</h3>
          </div>
          <div>
            <h3>2</h3>
          </div>
        </Slider>
      </Content>
      <div>Extra pane</div>
    </CardWrapper>
  );
};

export default MultiCard;
