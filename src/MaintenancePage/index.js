import React from 'react';
import styled from 'react-emotion';
import backgroundScene from './background-scene.png';
import logo from './logo-kids-first-drc.svg';
import { kfWebRoot, kfFacebook, kfTwitter, kfGithub } from 'common/injectGlobals';

const Container = styled('div')`
  background-color: #e3f6fd;
  /*bbackground-image: url(background-scene.png);
  	background-repeat: no-repeat;
  	background-position: center bottom;*/
  /*background-size: 1600px auto;*/
  font-size: 18px;
  font-family: Open Sans, sans-serif;
  line-height: 36px;
  text-align: center;
  height: 100%;
  position: absolute;
  left: 0px;
  right: 0px;
  .content-container {
    background-color: #fff;
    max-width: 780px;
    margin: 0 auto;
    padding: 40px;
    margin-top: 100px;
    border-radius: 10px;
    border: 1px solid #e0e1e6;
    box-shadow: 0px 0px 9.5px 0.5px rgba(160, 160, 163, 0.25);
    z-index: 100;
    position: relative;
  }
  .content-container p {
    padding: 10px 50px;
  }
  h1,
  h2 {
    font-family: Montserrat, sans-serif;
    font-weight: 500;
    color: #2b388f;
    font-size: 28px;
  }
  .background-img {
    /*display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;*/
    z-index: 0;
    position: fixed;
    bottom: 0;
    left: 0;
    min-width: 100%;
    min-height: 100%;
  }
  @media screen and (max-width: 1024px) {
    .background-img {
      left: 50%;
      margin-left: -512px; /* 50% */
    }
  }

  img {
    max-width: 100%;
    height: auto;
  }

  h2 {
    font-size: 24px;
  }

  a,
  a:visited,
  a:active {
    color: #90278e;
    text-decoration: underline;
  }
  a:hover {
    color: #e83a9c;
  }
  .teal-copy {
    color: #009bb8;
    font-style: italic;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
`;

export default () => (
  <Container>
    <img class="background-img" src={backgroundScene} alt="background" />

    <div class="content-container">
      <a href={kfWebRoot}>
        <img alt="Kids First DRC logo" src={logo} width="250" />
      </a>
      <br />
      <br />
      <h1>We are temporarily down for maintenance</h1>

      <p>
        The Kids First DRC Portal is currently down for scheduled maintenance, but not for long. We
        should be back online shortly.
      </p>
      <p class="teal-copy">Thank you for your patience!</p>

      <h2>In the meantime…</h2>
      <ul>
        <li>
          Read about the <a href={`${kfWebRoot}/about/drc_impact`}>benefits of Kids First DRC</a>
        </li>
        <li>
          Check out the latest <a href={`${kfWebRoot}/news`}>News &amp; Events</a>
        </li>
        <li>
          Follow us on <a href={kfFacebook}>Facebook</a>, <a href={kfTwitter}>Twitter</a> or{' '}
          <a href={kfGithub}>GitHub</a>
        </li>
      </ul>

      <p class="teal-copy">Go outside and play for a while!</p>
    </div>
  </Container>
);
