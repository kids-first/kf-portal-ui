import { Button } from 'antd';
import { ButtonProps } from 'antd/lib/button/button';
import cx from 'classnames';

import ExternalIcon from 'components/Icons/ExternalIcon';

import styles from './index.module.css';

type TLandingPageButton = ButtonProps & {
  alt?: boolean;
  external?: boolean;
};

const LandingPageButton = ({ alt = false, external = false, ...rest }: TLandingPageButton) => (
  <Button
    className={cx(styles.landingPageButton, rest.className, {
      [styles.primary]: !alt,
      [styles.secondary]: alt,
    })}
    {...rest}
  >
    {rest.children} {external && <ExternalIcon />}
  </Button>
);

export default LandingPageButton;
