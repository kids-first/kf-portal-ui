import { useRef } from 'react';
import intl from 'react-intl-universal';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Carousel, { CarouselRef } from 'antd/lib/carousel';
import cx from 'classnames';
import CarouselCard from 'views/LandingPage/StudiesSection/Carousel/Card';

import styles from './index.module.css';

const LoginCarousel = () => {
  const carouselRef = useRef<CarouselRef>(null);

  return (
    <div className={styles.carouselContainer}>
      <div className={cx(styles.controls, styles.previous)}>
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
      </div>
      <div className={styles.wrapper}>
        <Carousel ref={carouselRef} className={styles.carousel} dots={false}>
          <CarouselCard
            title={intl.get('screen.loginPage.studies.card1.title')}
            description={intl.get('screen.loginPage.studies.card1.description')}
            tags={['Cancer', 'Cross Condition', 'Congentital Disorder']}
            participants={22103}
          />
          <CarouselCard
            title={intl.get('screen.loginPage.studies.card2.title')}
            description={intl.get('screen.loginPage.studies.card2.description')}
            tags={['Cancer', 'Congentital Disorder']}
            participants={10022}
          />
          <CarouselCard
            title={intl.get('screen.loginPage.studies.card3.title')}
            description={intl.get('screen.loginPage.studies.card3.description')}
            tags={['Congentital Disorder']}
            participants={30000}
          />
        </Carousel>
      </div>
      <div className={cx(styles.controls, styles.next)}>
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
    </div>
  );
};

export default LoginCarousel;
