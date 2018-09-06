import scriptjs from 'scriptjs';
import urlJoin from 'url-join';
import { merge, pick } from 'lodash';
import { UI_VERSION } from 'common/constants';
import { getAppElement } from './globalDomNodes.js';

import { usersnapHost, usersnapId, arrangerProjectId } from 'common/injectGlobals';

let additionalUsersnapState = {
  email: null,
};

let sqonHistory = [];
export const addSqonHistory = sqon =>
  sqonHistory.push({
    time: new Date(),
    sqon,
  });

let usersnapInfo = {
  arrangerProjectId,
  sqonHistory,
  dataVersion: 'unreleased', // TODO add version when versioning is implemented
  portalVersion: UI_VERSION,
};
export const addInfo = obj => merge(usersnapInfo, obj);

export const addStateInfo = obj => addInfo({ state: obj });

export const addLoggedInUser = loggedInUser => {
  additionalUsersnapState.email = loggedInUser.email;
  addStateInfo({
    loggedInUser: pick(loggedInUser, ['acceptedTerms', 'egoId', 'roles', '_id', 'googleScholarId']),
  });
};

window._usersnapconfig = {
  lang: 'en',
  tools: ['pen', 'blackout', 'note', 'highlight', 'arrow', 'comment'],
  consoleRecorder: true,
  label: false,
  labelRequired: false,
  labelPlaceholder: 'UserFeedback',
  labelAllowCreate: false,
  labelMultiSelect: false,
  valign: 'bottom',
  halign: 'left',
  loadHandler: () => {
    window.UserSnap.on(
      'beforeSend',
      obj => (obj.addInfo = { ...usersnapInfo, reactAppRenderedDOM: getAppElement().innerHTML }),
    );
    window.UserSnap.on('beforeOpen', () => {
      if (additionalUsersnapState.email) {
        window.UserSnap.setEmailBox(additionalUsersnapState.email);
      }
    });
  },
};

export const init = () => scriptjs(urlJoin(usersnapHost, `${usersnapId}.js`));
