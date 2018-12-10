import React from 'react';
import { storiesOf } from '@storybook/react';

import BaseDataTable from '../../src/uikit/DataTable';

const mockData = [
  {
    particpantId: 'PT_JPHXHZFZ',
    externalId: 78724,
    studyName: 'Congential Heart Defect',
    proband: 'no',
    biospecimenId: 'BS_42425',
    analyteType: 'DNA',
    tissueType: 'normal',
    ageAtSampleAcquisition: '40 years 4 days',
  },
];

const mockColumns = [
  {
    Header: 'Participant ID',
    accessor: 'particpantId',
  },
  {
    Header: 'External ID',
    accessor: 'externalId',
  },
  {
    Header: 'Study Name',
    accessor: 'studyName',
  },
  {
    Header: 'Proband',
    accessor: 'proband',
  },
  {
    Header: 'Biospecimen ID',
    accessor: 'biospecimenId',
  },
  {
    Header: 'Analyte ID',
    accessor: 'analyteId',
  },
  {
    Header: 'Tissue Type',
    accessor: 'tissueType',
  },
  {
    Header: 'Age At Sample Acquiesition',
    accessor: 'ageAtSampleAcquisition',
  },
];

const CustomComponent = ({ children }) => <a href="https://www.google.ca">{children}</a>;

const customCellMockColumns = Object.assign([], mockColumns, {
  2: {
    Header: 'Study Name',
    accessor: 'studyName',
    Cell: props => <CustomComponent>{props.value}</CustomComponent>,
  },
});
console.log('custom mock cells', customCellMockColumns);

storiesOf('UIKit/DataTable', module)
  .add('default', () => <BaseDataTable data={mockData} columns={mockColumns} />)
  .add('custom cell component', () => (
    <BaseDataTable data={mockData} columns={customCellMockColumns} />
  ));

//.add('custom header component', () => null)
//.add('search table', () => null);
//.add('filters', () => null)
//.add('export', () => null)
