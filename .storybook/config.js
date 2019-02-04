import 'babel-polyfill';
import { configure, addDecorator } from '@storybook/react';
import StoryRouter from 'storybook-react-router';

const loadStories = () => {
  configure(() => require('../stories/index'), module);
};

addDecorator(StoryRouter());
loadStories();
