import { ReactElement } from 'react';
import EnvVariables from 'helpers/EnvVariables';
import cx from 'classnames';
import { Row } from 'antd';

import style from 'components/Layout/SideImage/index.module.css';
import { Theme } from 'common/theme';

interface OwnProps {
  alt?: boolean;
  logoSrc?: string;
  sideImgSrc?: string;
  alignCenter?: boolean;
  theme?: Theme;
  children: ReactElement;
}

const SideImageLayout = ({
  alt = false,
  logoSrc,
  sideImgSrc,
  alignCenter = true,
  theme = Theme.DARK,
  children,
}: OwnProps) => (
  <div className={cx(style.sideImagePageContainer, { [style.sideImagePageContainerAlt]: alt })}>
    {logoSrc && (
      <a href={EnvVariables.configFor('WEB_ROOT')}>
        <img className={style.logoImage} src={logoSrc} alt="Include Logo Logo" />
      </a>
    )}
    <Row className={style.contentWrapper}>
      <div
        className={style.sideImageContainer}
        style={{
          backgroundImage: `url(${sideImgSrc})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      />
      <Row
        className={cx(
          style.pageContent,
          alignCenter && style.alignCenter,
          theme === Theme.LIGHT ? style.light : style.dark,
          { [style.sideImagePageContainerAlt]: alt },
        )}
      >
        {children}
      </Row>
    </Row>
  </div>
);

export default SideImageLayout;
