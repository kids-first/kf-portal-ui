import React, { FC } from 'react';
import PageTitle from 'components/Text/PageTitle';

import style from './PageContent.module.scss';

type PageContentProps = {
  title: string | void;
};

const PageContent: FC<PageContentProps> = ({ children, title }) => (
  <div className={style.pageContentContainer}>
    <div className={style.pageContent}>
      {title && <PageTitle>{title}</PageTitle>}
      {children}
    </div>
  </div>
);

export default PageContent;
