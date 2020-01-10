import React from 'react';
import { Link } from 'react-router-dom';

import './Header.css';

export const NavLink = ({ children, className = '', to, currentPathName, ...props }) => {
  const classNames = `${className} navLink ${currentPathName === to ? 'active' : ''}`;
  return (
    <Link className={classNames} to={to} {...props}>
      {children}
    </Link>
  );
};

export const NavBarList = ({ children, style = {} }) => (
  <ul className="navBarList" style={{ ...style }}>
    {children}
  </ul>
);

export const LinkAsButton = ({ children, className, ...props }) => (
  <Link className={`linkAsButton ${className}`} {...props}>
    {children}
  </Link>
);
