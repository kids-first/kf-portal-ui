import React from 'react';
import { storiesOf } from '@storybook/react';

import BaseDataTable from '../../src/uikit/DataTable';

storiesOf('UIKit/DataTable', module).add('default', () => <BaseDataTable data={[]} columns={[]} />);
//.add('custom header component', () => null)
//.add('custom cell component', () => null)
//.add('search table', () => null);
