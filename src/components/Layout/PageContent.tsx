import React, { FC } from 'react';
import { Typography } from 'antd';

import style from './PageContent.module.scss';
const { Title } = Typography;

type PageContentProps = {
  title: string | void;
};

const PageContent: FC<PageContentProps> = ({ children, title }) => (
  <div className={style.pageContentContainer}>
    <div className={style.pageContent}>
      {title && <Title level={1}>{title}</Title>}
      {children}
    </div>
  </div>
);

export default PageContent;
