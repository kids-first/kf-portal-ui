import React from 'react';
import { storiesOf } from '@storybook/react';
import Component from 'react-component-component';

storiesOf('Storybook ego login', module).add('login', () => {
  const initialState = { egoToken: localStorage.EGO_JWT };
  const onEgoTokenChange = s => e => {
    const value = e.target.value;
    localStorage.setItem('EGO_JWT', value);
    s.setState({ egoToken: value });
  };
  return (
    <Component initialState={initialState}>
      {s => (
        <div>
          <div>Put your ego token here: </div>
          <textarea value={s.state.egoToken} onChange={onEgoTokenChange(s)} />
        </div>
      )}
    </Component>
  );
});
