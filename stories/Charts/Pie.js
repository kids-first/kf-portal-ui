// @DOCS https://nivo.rocks/pie/
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Pie from '../../src/components/charts';

import { demographicPiesMock } from './mocks';

storiesOf('Charts/Pie', module).add('default', () => (
    <Pie />
));
