import { ReactElement } from 'react';
import EnvVariables from 'helpers/EnvVariables';
import cx from 'classnames';
import { Row } from 'antd';

import style from 'components/Layout/SideImage/index.module.scss';
import { Theme } from 'common/theme';

interface OwnProps {
  logoSrc?: string;
  sideImgSrc?: string;
  alignCenter?: boolean;
  theme?: Theme;
  children: ReactElement;
}

const SideImageLayout = ({
  logoSrc,
  sideImgSrc,
  alignCenter = true,
  theme = Theme.DARK,
  children,
}: OwnProps) => (
  <div className={style.sideImagePageContainer}>
    {logoSrc && (
      <a href={EnvVariables.configFor('INCLUDE_WEB_ROOT')}>
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
        )}
      >
        {children}
      </Row>
    </Row>
  </div>
);

export default SideImageLayout;
