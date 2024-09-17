import LandingPageButton from 'views/LandingPage/Components/LandingPageButton';
import LandingPageParagraph from 'views/LandingPage/Components/LandingPageParagraph';
import LandingPageTitle from 'views/LandingPage/Components/LandingPageTitle';

import styles from './index.module.css';

type TFooterCard = {
  title: string;
  description: string;
  buttonText: string;
  external?: boolean;
  handleClick?: () => void;
};

const FooterCard = ({
  title,
  description,
  buttonText,
  external = false,
  handleClick,
}: TFooterCard) => (
  <div className={styles.footerCard}>
    <LandingPageTitle>{title}</LandingPageTitle>
    <LandingPageParagraph lead>{description}</LandingPageParagraph>
    <div>
      <LandingPageButton size="large" ghost alt external={external} onClick={handleClick}>
        {buttonText}
      </LandingPageButton>
    </div>
  </div>
);

export default FooterCard;
