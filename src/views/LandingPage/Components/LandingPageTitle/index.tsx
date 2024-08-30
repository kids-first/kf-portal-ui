import { Typography } from 'antd';
import { TitleProps } from 'antd/lib/typography/Title';
import cx from 'classnames';

import styles from './index.module.css';

const { Title } = Typography;

type TLandingPageTitle = TitleProps & {
  alt?: boolean;
  margin?: number;
};

const LandingPageTitle = ({ alt = false, margin = 0, ...props }: TLandingPageTitle) => (
  <Title
    {...props}
    style={{ marginBottom: `${margin}px` }}
    className={cx(styles.landingPageTitle, props.className, { [styles.alt]: alt })}
  />
);

export default LandingPageTitle;
