import React from 'react';

import './Multicard.css';

const Header = ({ children, active, ...props }) => (
  <div className={`multicardTabMenuHeader ${active ? 'active' : ''}`} {...props}>
    {children}
  </div>
);

const TabMenu = ({ title, onClick, active }) => (
  <Header onClick={onClick} active={active}>
    {title}
  </Header>
);
export default TabMenu;
