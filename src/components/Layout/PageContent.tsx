import React, { FC, ReactNode } from 'react';
import { Typography } from 'antd';
import style from './PageContent.module.scss';

const { Title } = Typography;

type PageContentProps = {
  title: string | ReactNode;
};

const PageContent: FC<PageContentProps> = ({ children, title }) => (
  <div className={style.pageContentContainer}>
    <div className={style.pageContent}>
      {!!title && typeof title === 'string' ? <Title level={1}>{title}</Title> : title}
      {children}
    </div>
  </div>
);

export default PageContent;
