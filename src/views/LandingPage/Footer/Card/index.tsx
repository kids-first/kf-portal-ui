import LandingPageButton from 'views/LandingPage/Components/LandingPageButton';
import LandingPageParagraph from 'views/LandingPage/Components/LandingPageParagraph';
import LandingPageTitle from 'views/LandingPage/Components/LandingPageTitle';

import styles from './index.module.css';

type TFooterCard = {
  title: string;
  description: string;
  buttonText: string;
};

const FooterCard = ({ title, description, buttonText }: TFooterCard) => (
  <div className={styles.footerCard}>
    <LandingPageTitle>{title}</LandingPageTitle>
    <LandingPageParagraph lead>{description}</LandingPageParagraph>
    <div>
      <LandingPageButton size="large" ghost alt external>
        {buttonText}
      </LandingPageButton>
    </div>
  </div>
);

export default FooterCard;
