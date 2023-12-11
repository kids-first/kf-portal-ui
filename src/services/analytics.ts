import EnvironmentVariables from 'helpers/EnvVariables';
import ReactGA from 'react-ga4';

const measurementId = EnvironmentVariables.configFor('MEASUREMENT_ID');
const isDev = EnvironmentVariables.configFor('ENV') === 'development';
const isGaActive = measurementId && !isDev;

export const initGa = () => {
  if (isGaActive) {
    ReactGA.initialize(measurementId);
  }
};

export const trackAuthSuccess = () => {
  if (isGaActive) {
    ReactGA.event({
      category: 'Authentication',
      action: 'login success',
    });
  }
};
