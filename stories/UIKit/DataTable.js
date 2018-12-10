import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'emotion-theming';

import BaseDataTable from '../../src/uikit/DataTable';

const fonts = {
  default: 'Montserrat, sans-serif',
  details: 'Open Sans, sans-serif',
};

const colors = {
  white: '#ffffff',
  primary: '#90278e', //magenta
  primaryLight: '#a42c90', //lighter magenta
  secondary: '#2b388f', //purplish blue
  primaryHover: '#404c9a', //purple
  tertiary: '#009bb8', //teal-blue
  highlight: '#e83a9c', //pink
  hover: '#c03299', //also pink
  tertiaryHover: '#19a9c4', //lighter teal-blue
  borderGrey: '#cacbcf',
  backgroundGrey: '#f4f5f8',
  tertiaryBackground: '#edeef1', // light light blue
  lightBlue: '#008199',
  orange: '#ffaa52',
};
const theme = {
  ...colors,
  fonts,
};

const ThemeDecorator = storyFn => <ThemeProvider theme={theme}>{storyFn()}</ThemeProvider>;

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
  .addDecorator(ThemeDecorator)
  .add('default', () => <BaseDataTable data={mockData} columns={mockColumns} />)
  .add('custom cell component', () => (
    <BaseDataTable data={mockData} columns={customCellMockColumns} />
  ));

//.add('custom header component', () => null)
//.add('search table', () => null);
//.add('filters', () => null)
//.add('export', () => null)
