import React from 'react';
import ScrollContent from '@ferlab/ui/core/layout/ScrollContent';
import { Layout as AntLayout } from 'antd';

import { MAIN_SCROLL_WRAPPER_ID } from 'common/constants';
import Footer from 'components/Layout/Footer';
import Header from 'components/Layout/Header';

import styles from './index.module.css';

interface OwnProps {
  children: React.ReactElement;
  scrollbarEnabled?: boolean;
}

const Layout = ({ children, scrollbarEnabled = true }: OwnProps) => (
  <AntLayout className={styles.mainLayout}>
    <Header />
    {scrollbarEnabled ? (
      <ScrollContent id={MAIN_SCROLL_WRAPPER_ID} className={styles.mainContent}>
        <div id="content">{children}</div>
      </ScrollContent>
    ) : (
      <div className={`${styles.mainContent} ${styles.noScrollbar}`}>
        <div id="content">{children}</div>
      </div>
    )}
    <Footer />
  </AntLayout>
);

export default Layout;
