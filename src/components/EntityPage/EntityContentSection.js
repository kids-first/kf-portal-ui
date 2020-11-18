import * as React from 'react';
import PropTypes from 'prop-types';

import Column from 'uikit/Column';

import './EntityPage.css';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const EntityContentSection = ({ title, children, size, tabs, setActiveTab, defaultTab }) => (
  <Column className="entityContentSection-container">
    <h2 className={`entityContentSection-title ${size}`}>{title}</h2>
    {tabs && tabs.some((t) => !t.isDisabled) ? (
      <Tabs defaultActiveKey={defaultTab} onChange={setActiveTab}>
        {tabs
          .filter((t) => !t.isDisabled)
          .map((t) => (
            <TabPane tab={t.tabName} key={t.accessor} disabled={t.isDisabled}>
              <div className="entityContentSection-content">{children}</div>
            </TabPane>
          ))}
      </Tabs>
    ) : (
      <div className="entityContentSection-content">{children}</div>
    )}
  </Column>
);

EntityContentSection.propTypes = {
  title: PropTypes.string.isRequired,
  tabs: PropTypes.arrayOf(PropTypes.object),
  defaultTab: PropTypes.string,
  setActiveTab: PropTypes.func,
  children: PropTypes.any.isRequired,
  size: PropTypes.string,
};

export default EntityContentSection;
