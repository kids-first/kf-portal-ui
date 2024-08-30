import intl from 'react-intl-universal';
import { numberFormat } from '@ferlab/ui/core/utils/numberUtils';
import { Divider, Space, Tag } from 'antd';
import LandingPageParagraph from 'views/LandingPage/Components/LandingPageParagraph';
import LandingPageTitle from 'views/LandingPage/Components/LandingPageTitle';

import participantSvg from 'components/assets/kf-portal-icons_participants_3.svg';

import styles from './index.module.css';

type TCarouselCard = {
  title: string;
  description: string;
  participants: number;
  tags: string[];
};

const MAX_LENGTH = 600;
const clampText = (text: string): string => {
  if (text.length > MAX_LENGTH) {
    return `${text.substring(0, MAX_LENGTH)}…`;
  }

  return text;
};

export const CarouselCard = ({ title, description, participants, tags }: TCarouselCard) => (
  <div className={styles.carouselCard}>
    <LandingPageTitle className={styles.title} level={4} margin={16}>
      {title}
    </LandingPageTitle>
    <LandingPageParagraph className={styles.description}>
      {clampText(description)}
    </LandingPageParagraph>
    <Divider className={styles.divider} />
    <Space>
      <span className={styles.participant}>
        <img src={participantSvg} width={40} height={40} />
        <Space>
          <LandingPageParagraph lead bold>
            {numberFormat(participants ?? 0)}
          </LandingPageParagraph>
          <LandingPageParagraph small>
            {intl.get('screen.loginPage.studies.participants', { count: participants })}
          </LandingPageParagraph>
        </Space>
      </span>
      {tags.map((tag) => (
        <Tag className={styles.tag}>{tag}</Tag>
      ))}
    </Space>
  </div>
);

export default CarouselCard;
