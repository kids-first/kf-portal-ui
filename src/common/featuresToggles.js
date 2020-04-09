import camelCase from 'lodash/camelCase';

import { getApplicationEnvVar } from 'common/injectGlobals';

const featureTogglePrefix = 'REACT_APP_FT';
const togglePrefix = 'REACT_APP_';

const isEnabled = (featureName, enabledFeatures = {}, defaultValue = true) => {
  const flag = getApplicationEnvVar(featureName);

  // missing feature flags defaults to their default
  if (typeof flag === 'undefined') return defaultValue;

  // any casing for 'false', false, 0 and '0' are all disabled
  // eslint-disable-next-line eqeqeq
  if (flag === false || flag.toString().toLowerCase() === 'false' || flag === 0) {
    return enabledFeatures[featureName] === true;
  }

  // the rest is enabled (but could contain a value like 'canary' or 'ADMIN')
  return true;
};

const toggles = queryStrings =>
  Array.from(Object.entries(process.env))
    .filter(env => {
      return typeof env[1] === 'string';
    })
    .filter(env => env[0].startsWith(featureTogglePrefix))
    .reduce(
      (allToggles, toggle) => {
        allToggles[camelCase(toggle[0].slice(featureTogglePrefix.length))] = isEnabled(
          toggle[0].slice(togglePrefix.length),
          queryStrings,
        );
        return allToggles;
      },
      {
        // anotherFeature: getApplicationEnvVar('SOME_KEY') === 'SOME VALUE',
        // yetAnotherFeature: typeof getApplicationEnvVar('SOME_KEY') !== 'undefined',
      },
    );

/**
 * Checks if a feature is enabled or not.
 * @param {String} featureName - The name of the feature, as defined in the feature toggles configuration.
 * @param features
 * @returns {Boolean} `true` if the name feature exists and is enabled; `false` otherwise.
 */
export const isFeatureEnabled = (featureName, features = {}) =>
  toggles(features)[featureName] === true;
