import featureToggles from 'feature-toggles';
import camelCase from 'lodash/camelCase';

const featureTogglePrefix = 'REACT_APP_FT';

const isEnabled = flag => {
  if (!flag || ['false', '0', 'no', 'n'].some(falsy => flag.toString().toLowerCase() === falsy)) {
    return false;
  }
  // the rest is enabled (but could contain a value like 'canary' or 'ADMIN')
  return true;
};

const toggles = Array.from(Object.entries(process.env))
  .filter(env => {
    return typeof env[1] === 'string';
  })
  .filter(env => env[0].startsWith(featureTogglePrefix))
  .reduce((allToggles, toggle) => {
    allToggles[camelCase(toggle[0].slice(featureTogglePrefix.length))] = isEnabled(toggle[1]);
    return allToggles;
  }, {});

featureToggles.load({
  ...toggles,
  // anotherFeature: getApplicationEnvVar('SOME_KEY') === 'SOME VALUE',
  // yetAnotherFeature: typeof getApplicationEnvVar('SOME_KEY') !== 'undefined',
});

/**
 * Checks if a feature is enabled or not.
 * @param {String} featureName - The name of the feature, as defined in the feature toggles configuration.
 * @returns {Boolean} `true` if the name feature exists and is enabled; `false` otherwise.
 */
export const isFeatureEnabled = featureToggles.isFeatureEnabled.bind(featureToggles);
