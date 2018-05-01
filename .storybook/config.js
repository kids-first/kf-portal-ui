import 'babel-polyfill';
import { configure } from '@storybook/react';

const loadStories = () => {
  configure(() => require('../stories/index'), module);
};

loadStories();
