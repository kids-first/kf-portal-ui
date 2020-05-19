import * as React from 'react';
import PropTypes from 'prop-types';

import Column from 'uikit/Column';

import './EntityPage.css';
import Tabs from 'antd/es/tabs';

const { TabPane } = Tabs;

const EntityContentSection = ({ title, children, size, tabs, activeTab, setActiveTab }) => (
  <Column className="entityContentSection-container">
    <h2 className={`entityContentSection-title ${size}`}>{title}</h2>
    {tabs ? (
      <Tabs defaultActiveKey={activeTab.accessor} onChange={setActiveTab}>
        {tabs.map((t) => (
          <TabPane tab={t.tabName} key={`${t.accessor}`}>
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
};

EntityContentSection.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.object),
  activeTab: PropTypes.object,
  setActiveTab: PropTypes.func,
  children: PropTypes.element.isRequired,
  size: PropTypes.string,
};

export default EntityContentSection;
