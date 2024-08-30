import { Typography } from 'antd';
import cx from 'classnames';
import LandingPageButton from 'views/LandingPage/Components/LandingPageButton';
import LandingPageParagraph from 'views/LandingPage/Components/LandingPageParagraph';
import LandingPageTitle from 'views/LandingPage/Components/LandingPageTitle';

import styles from './index.module.css';

type TCollaboratorCard = {
  icon: React.ReactNode;
  alt?: boolean;
  title?: string;
  external?: boolean;
  description: string;
  buttonText: string;
  handleClick?: () => void;
};

const CollaboratorCard = ({
  icon,
  title,
  alt = false,
  external,
  description,
  buttonText,
  handleClick,
}: TCollaboratorCard) => (
  <div
    className={cx(styles.collaboratorCard, {
      [styles.alt]: alt,
    })}
  >
    <div className={styles.header}>
      {icon}
      <LandingPageTitle level={3}>{title}</LandingPageTitle>
    </div>
    <LandingPageParagraph>{description}</LandingPageParagraph>
    <LandingPageButton alt={alt} ghost size="large" external={external} onClick={handleClick}>
      {buttonText}
    </LandingPageButton>
  </div>
);

export default CollaboratorCard;
