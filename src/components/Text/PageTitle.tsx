import React, { FC } from 'react';

import style from './PageTitle.module.scss';

const PageContent: FC = ({ children }) => <h1 className={style.pageTitle}>{children}</h1>;

export default PageContent;
