import React from 'react';
import { storiesOf } from '@storybook/react';
import { css } from 'react-emotion';

import Button, { LightButton } from '../src/uikit/Button';
import Dropdown from '../src/uikit/Dropdown';

storiesOf('UIKit', module)
  .add('Button', () => (
    <React.Fragment>
      <Button>Button</Button>
    </React.Fragment>
  ))
  .add('Light Button', () => (
    <React.Fragment>
      <LightButton>Light Button</LightButton>
    </React.Fragment>
  ))
  .add('Dropdown', () => (
    <div>
      <Dropdown
        items={['Item one', 'Item two', 'Item three']}
        className={css`
          width: 200px;
          height: 30px;
        `}
      >
        A Dropdown
      </Dropdown>
    </div>
  ));
