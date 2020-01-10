import React from 'react';

import backgroundScene from './background-scene.png';
import logo from './logo-kids-first-drc.svg';
import { kfWebRoot, kfFacebook, kfTwitter, kfGithub } from 'common/injectGlobals';

import './MaintenancePage.css';

export default () => (
  <div className="maintenancePageContainer">
    <img className="background-img" src={backgroundScene} alt="background" />

    <div className="content-container">
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
      <p className="teal-copy">Thank you for your patience!</p>

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

      <p className="teal-copy">Go outside and play for a while!</p>
    </div>
  </div>
);
