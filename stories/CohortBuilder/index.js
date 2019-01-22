import React from 'react';
import { storiesOf } from '@storybook/react';

storiesOf('CohortBuilder', module)
  .add('Page Layout', () => {
    return <div>Add the index of the cohort builder here</div>;
  })
  .add('Menu Bar', () => {
    return <div>Add menu bar component here</div>;
  })
  .add('Checkbox Filters UI', () => {
    return <div>add checkbox filters UI here</div>;
  })
  .add('Continuous filters UI', () => {
    return <div>add Continuous filters UI here</div>;
  })
  .add('Boolean Filters UI', () => {
    return <div>add Boolean Filters UI here</div>;
  })
  .add('Phenotypes tree', () => {
    return <div>add phenotypes tree component here</div>;
  })
  .add('Sqon Builder Integration', () => {
    return <div>add Sqon Builder Integration here</div>;
  });
