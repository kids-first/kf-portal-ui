import scriptjs from 'scriptjs';
import urlJoin from 'url-join';
import { merge, pick } from 'lodash';

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
  portalVersion: '0.0.0.0',
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
  label: true,
  labelRequired: true,
  labelPlaceholder: 'UserFeedback',
  labelAllowCreate: false,
  labelMultiSelect: false,
  loadHandler: () => {
    window.UserSnap.on('beforeSend', obj => (obj.addInfo = usersnapInfo));
    window.UserSnap.on('beforeOpen', () => {
      if (additionalUsersnapState.email) {
        window.UserSnap.setEmailBox(additionalUsersnapState.email);
      }
    });
  },
};

// export const init = () => scriptjs(urlJoin(usersnapHost, `${usersnapId}.js`));
export const init = () => scriptjs(urlJoin(usersnapHost, `062f6823-2700-4ea6-ae47-d8af637db66d.js`));
