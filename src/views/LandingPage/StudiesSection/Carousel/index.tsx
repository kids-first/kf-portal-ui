import { useRef } from 'react';
import intl from 'react-intl-universal';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Carousel, { CarouselRef } from 'antd/lib/carousel';
import CarouselCard from 'views/LandingPage/StudiesSection/Carousel/Card';

import { IStudiesStatistics } from '../../../../services/api/arranger/models';
import { useGlobals } from '../../../../store/global';

import styles from './index.module.css';

const studies = [
  { code: 'CBTN', formattedCode: 'cbtn' },
  { code: 'KF-CHD', formattedCode: 'kfchd' },
  { code: 'KF-CHDALL', formattedCode: 'kfchdall' },
  {
    code: 'KF-CDH',
    formattedCode: 'kfcdh',
  },
  { code: 'KF-GNINT', formattedCode: 'kfgnint' },
  { code: 'KF-NBL', formattedCode: 'kfnbl' },
  { code: 'KF-KUT', formattedCode: 'kfkut' },
  { code: 'KF-OCEA', formattedCode: 'kfocea' },
  { code: 'KF-TALL', formattedCode: 'kftall' },
  { code: 'KF-ESGR', formattedCode: 'kfesgr' },
];

const formatStudies = (
  studiesStatistics: Record<string, Omit<IStudiesStatistics, 'study_code'>> = {},
) =>
  studies.map((study) => {
    const studyStats = studiesStatistics[study.code] || {};
    const domain = studyStats?.domain || 'unknown';
    const participants = studyStats?.participant_count || 0;

    return {
      code: study.code,
      title: intl.get(`screen.loginPage.studies.${study.formattedCode}.name`),
      description: intl.get(`screen.loginPage.studies.${study.formattedCode}.description`),
      tags: [intl.get(`screen.loginPage.studies.tags.${domain}`)] || [domain] || [],
      participants: participants,
    };
  });

const LoginCarousel = () => {
  const { stats } = useGlobals();
  const { studiesStatistics = {} } = stats || {};
  const formattedStudies = formatStudies(studiesStatistics); // Fixed studiesStatistics reference
  const carouselRef = useRef<CarouselRef>(null);

  return (
    <div className={styles.carouselContainer}>
      <Button
        ghost
        shape="circle"
        className={styles.button}
        icon={<LeftOutlined />}
        onClick={() => {
          if (carouselRef?.current) {
            carouselRef.current.prev();
          }
        }}
      />
      <Carousel ref={carouselRef} className={styles.carousel} dots={false} adaptiveHeight>
        {formattedStudies.map((card, index) => (
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
          if (carouselRef?.current) {
            carouselRef.current.next();
          }
        }}
      />
    </div>
  );
};

export default LoginCarousel;
