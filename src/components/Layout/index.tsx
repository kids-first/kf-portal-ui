import React from 'react';
import { Layout as AntLayout } from 'antd';
import Header from 'components/Layout/Header';
import Footer from 'components/Layout/Footer';
import ScrollContent from '@ferlab/ui/core/layout/ScrollContent';
import { MAIN_SCROLL_WRAPPER_ID } from 'common/constants';

import styles from './index.module.scss';

interface OwnProps {
  children: React.ReactElement;
}

const Layout = ({ children }: OwnProps) => (
  <AntLayout className={styles.mainLayout}>
    <Header />
    <ScrollContent id={MAIN_SCROLL_WRAPPER_ID} className={styles.mainContent}>
      <div id="content">{children}</div>
    </ScrollContent>
    <Footer />
  </AntLayout>
);

export default Layout;
