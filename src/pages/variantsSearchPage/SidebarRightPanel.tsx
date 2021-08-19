import React from 'react';
import ScrollView from '@ferlab/ui/core/layout/ScrollView';

import CloseIconOutlined from 'icons/CloseIconOutlined';

import styles from './SidebarRightPanel.module.scss';

type OwnProps = {
  onClose?: Function;
  isOpen: boolean;
  children: React.ReactNode | string;
};

const VariantFiltersSiderRightPanel = ({
  onClose = () => {},
  isOpen = false,
  children,
}: OwnProps) => (
  <div className={styles.rightPanel} style={{ display: isOpen ? 'block' : 'none' }}>
    <div className={styles.rightPanelHeader}>
      <a
        onClick={() => {
          onClose();
        }}
      >
        <CloseIconOutlined width={'16px'} />
      </a>
    </div>
    <ScrollView>{children}</ScrollView>
  </div>
);

export default VariantFiltersSiderRightPanel;
