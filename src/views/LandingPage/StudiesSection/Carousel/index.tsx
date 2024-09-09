import { useRef } from 'react';
import intl from 'react-intl-universal';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Carousel, { CarouselRef } from 'antd/lib/carousel';
import CarouselCard from 'views/LandingPage/StudiesSection/Carousel/Card';

import styles from './index.module.css';

const carouselCardsData = () => [
  {
    title: intl.get('screen.loginPage.studies.card1.title'),
    description: intl.get('screen.loginPage.studies.card1.description'),
    tags: ['Cancer', 'Cross Condition', 'Congentital Disorder'],
    participants: 22103,
  },
  {
    title: intl.get('screen.loginPage.studies.card2.title'),
    description: intl.get('screen.loginPage.studies.card2.description'),
    tags: ['Cancer', 'Congenital Disorder'],
    participants: 10022,
  },
  {
    title: intl.get('screen.loginPage.studies.card3.title'),
    description: intl.get('screen.loginPage.studies.card3.description'),
    tags: ['Congenital Disorder'],
    participants: 30000,
  },
];

const LoginCarousel = () => {
  const carouselRef = useRef<CarouselRef>(null);
  const data = carouselCardsData();

  return (
    <div className={styles.carouselContainer}>
      <Button
        ghost
        shape="circle"
        className={styles.button}
        icon={<LeftOutlined />}
        onClick={() => {
          if (carouselRef && carouselRef.current) {
            carouselRef?.current.prev();
          }
        }}
      />
      <Carousel ref={carouselRef} className={styles.carousel} dots={false}>
        {data.map((card, index) => (
          <CarouselCard
            key={index}
            title={card.title}
            description={card.description}
            tags={card.tags}
            participants={card.participants}
          />
        ))}
      </Carousel>
      <Button
        ghost
        shape="circle"
        className={styles.button}
        icon={<RightOutlined />}
        onClick={() => {
          if (carouselRef && carouselRef.current) {
            carouselRef?.current.next();
          }
        }}
      />
    </div>
  );
};

export default LoginCarousel;
