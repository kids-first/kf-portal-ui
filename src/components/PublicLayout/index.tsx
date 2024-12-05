import React from 'react';
import ScrollContent from '@ferlab/ui/core/layout/ScrollContent';
import { Layout as AntLayout } from 'antd';

import { MAIN_SCROLL_WRAPPER_ID } from 'common/constants';

import Header from './Header';

import styles from './index.module.css';

interface OwnProps {
  children: React.ReactElement;
}

const PublicLayout = ({ children }: OwnProps) => (
  <AntLayout className={styles.mainLayout}>
    <Header />
    <ScrollContent id={MAIN_SCROLL_WRAPPER_ID} className={styles.mainContent}>
      <div id="content">{children}</div>
    </ScrollContent>
  </AntLayout>
);

export default PublicLayout;
