import React from 'react';
import { Link } from 'react-router-dom';
import { css } from 'react-emotion';

const SideImagePage = ({ backgroundImage, logo, Component, sideImage, ...props }) => (
  <div
    className={css`
      position: relative;
      height: 100vh;
      overflow-y: hidden;
      min-width: 1024;
      background-image: url(${backgroundImage});
    `}
  >
    <div
      className={css`
        width: 100%;
        height: 5px;
        background-image: linear-gradient(to right, #90278e, #cc3399 35%, #be1e2d 66%, #f6921e);
      `}
    />
    <Link to="/">
      <img
        src={logo}
        alt="Kids First Logo"
        className={css`
          width: 230px;
          position: absolute;
          margin: 20px;
        `}
      />
    </Link>
    <div
      className={css`
        background-repeat: repeat;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: row;
        background-image: linear-gradient(to bottom, #fff 400px, transparent 100%);
      `}
    >
      <div
        className={css`
          background: #fff;
          background-image: url(${sideImage});
          background-repeat: no-repeat;
          background-position: bottom;
          width: 573px;
          height: 100%;
          box-shadow: 0 0 6px 0.1px #bbbbbb;
        `}
      />
      <Component {...props} />
    </div>
  </div>
);

export default SideImagePage;
