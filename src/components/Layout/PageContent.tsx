import React, { ReactNode } from 'react';
import { Typography } from 'antd';
import style from './PageContent.module.scss';

const { Title } = Typography;

type PageContentProps = {
  className?: string;
  title: string | ReactNode;
  children: ReactNode;
};

const PageContent = ({ className = '', children, title }: PageContentProps) => (
  <div className={style.pageContentContainer}>
    <div className={`${style.pageContent} ${className}`}>
      {title && typeof title === 'string' ? <Title level={1}>{title}</Title> : title}
      {children}
    </div>
  </div>
);

export default PageContent;
