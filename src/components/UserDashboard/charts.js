import React from 'react';
import { withTheme } from 'emotion-theming';
import _ from 'lodash';

import HorizontalBar from 'chartkit/components/HorizontalBar';

const fileRepoLinks = [
  {
    name: 'Pediatric Brain Tumors: CBTTC',
    url: `/search/file?sqon=%7B%22op%22%3A%22and%22%2C%22content%22%3A%5B%7B%22op%22%3A%22in%22%2C%22content%22%3A%7B%22field%22%3A%22participants.study.short_name%22%2C%22value%22%3A%5B%22Pediatric%20Brain%20Tumors%3A%20CBTTC%22%5D%7D%7D%5D%7D`,
  },
  {
    name: 'Orofacial Cleft: European Ancestry',
    url: `/search/file?sqon=%7B%22op%22%3A%22and%22%2C%22content%22%3A%5B%7B%22op%22%3A%22in%22%2C%22content%22%3A%7B%22field%22%3A%22participants.study.short_name%22%2C%22value%22%3A%5B%22Orofacial%20Cleft%3A%20European%20Ancestry%22%5D%7D%7D%5D%7D`,
  },
  {
    name: 'Ewing Sarcoma: Genetic Risk',
    url: `/search/file?sqon=%7B%22op%22%3A%22and%22%2C%22content%22%3A%5B%7B%22op%22%3A%22in%22%2C%22content%22%3A%7B%22field%22%3A%22participants.study.short_name%22%2C%22value%22%3A%5B%22Ewing%20Sarcoma%3A%20Genetic%20Risk%22%5D%7D%7D%5D%7D`,
  },
  {
    name: 'Syndromic Cranial Dysinnervation',
    url: `/search/file?sqon=%7B%22op%22%3A%22and%22%2C%22content%22%3A%5B%7B%22op%22%3A%22in%22%2C%22content%22%3A%7B%22field%22%3A%22participants.study.short_name%22%2C%22value%22%3A%5B%22Syndromic%20Cranial%20Dysinnervation%22%5D%7D%7D%5D%7D`,
  },
  {
    name: 'Congenital Heart Defects',
    url: `/search/file?sqon=%7B%22op%22%3A%22and%22%2C%22content%22%3A%5B%7B%22op%22%3A%22in%22%2C%22content%22%3A%7B%22field%22%3A%22participants.study.short_name%22%2C%22value%22%3A%5B%22Congenital%20Heart%20Defects%22%5D%7D%7D%5D%7D`,
  },
  {
    name: 'Adolescent Idiopathic Scoliosis',
    url: `/search/file?sqon=%7B%22op%22%3A%22and%22%2C%22content%22%3A%5B%7B%22op%22%3A%22in%22%2C%22content%22%3A%7B%22field%22%3A%22participants.study.short_name%22%2C%22value%22%3A%5B%22Adolescent%20Idiopathic%20Scoliosis%22%5D%7D%7D%5D%7D`,
  },
  {
    name: 'Congenital Diaphragmatic Hernia',
    url: `/search/file?sqon=%7B%22op%22%3A%22and%22%2C%22content%22%3A%5B%7B%22op%22%3A%22in%22%2C%22content%22%3A%7B%22field%22%3A%22participants.study.short_name%22%2C%22value%22%3A%5B%22Congenital%20Diaphragmatic%20Hernia%22%5D%7D%7D%5D%7D`,
  },
];

export const StudiesChart = withTheme(({ data, theme }) => {
  const mergedStudyData = data.map(d => ({
    ...d,
    ..._.find(fileRepoLinks, { name: d.name }),
  }));

  const onClick = barData => (parent.window.location.href = barData.data.url);

  return (
    <HorizontalBar
      data={mergedStudyData}
      indexBy="name"
      keys={['probands', 'familyMembers']}
      onClick={onClick}
      tickInterval={4}
      padding={15}
      colors={[theme.chartColors.blue, theme.chartColors.purple]}
      xTickTextLength={28}
      legends={[
        { title: 'Probands', color: theme.chartColors.blue },
        { title: 'Family Members', color: theme.chartColors.purple },
      ]}
      padding={0.7}
    />
  );
});

const topDiagnosesChartMock = [
  { name: 'disease or disorder', probands: 923, familyMembers: _.random(0, 500) },
  { name: 'congenital diaphragmatic hernia', probands: 512, familyMembers: _.random(0, 500) },
  { name: 'nervous system disorder', probands: 376, familyMembers: _.random(0, 500) },
  { name: 'Ewing sarcoma', probands: 379, familyMembers: _.random(0, 500) },
  { name: 'epilepsy', probands: 294, familyMembers: _.random(0, 500) },
  { name: 'low grade glioma', probands: 270, familyMembers: _.random(0, 500) },
  { name: 'hydrocephalus', probands: 245, familyMembers: _.random(0, 500) },
  { name: 'vision disorder', probands: 223, familyMembers: _.random(0, 500) },
  { name: 'medulloblastoma', probands: 129, familyMembers: _.random(0, 500) },
  { name: 'grade III glioma', probands: 109, familyMembers: _.random(0, 500) },
  { name: 'mood disorder', probands: 96, familyMembers: _.random(0, 500) },
  { name: 'ependymoma', probands: 91, familyMembers: _.random(0, 500) },
  {
    name: 'macrocephaly-developmental delay syndrome',
    probands: 83,
    familyMembers: _.random(0, 500),
  },
  { name: 'diffuse intrinsic pontine glioma', probands: 79, familyMembers: _.random(0, 500) },
  { name: 'endocrine system disease', probands: 64, familyMembers: _.random(0, 500) },
  { name: 'ganglioglioma', probands: 54, familyMembers: _.random(0, 500) },
  { name: 'other acquired skin disease', probands: 47, familyMembers: _.random(0, 500) },

  { name: 'meningioma (disease)', probands: 31, familyMembers: _.random(0, 500) },
  { name: 'atypical teratoid rhabdoid tumor', probands: 29, familyMembers: _.random(0, 500) },
  { name: 'dysembryoplastic neuroepithelial tumor', probands: 29, familyMembers: _.random(0, 500) },
  { name: 'plexiform neurofibroma (disease)', probands: 24, familyMembers: _.random(0, 500) },
  { name: 'inherited genetic disease', probands: 23, familyMembers: _.random(0, 500) },
  {
    name: 'spinal cord primitive neuroectodermal tumor',
    probands: 21,
    familyMembers: _.random(0, 500),
  },
  { name: 'schwannoma', probands: 17, familyMembers: _.random(0, 500) },
  { name: 'choroid plexus papilloma', probands: 18, familyMembers: _.random(0, 500) },
  { name: 'Gnathodiaphyseal dysplasia', probands: 17, familyMembers: _.random(0, 500) },
  { name: 'tuberous sclerosis', probands: 14, familyMembers: _.random(0, 500) },
  { name: 'teratoma', probands: 10, familyMembers: _.random(0, 500) },
  { name: 'Li-Fraumeni syndrome', probands: 8, familyMembers: _.random(0, 500) },
  { name: 'metastatic melanoma', probands: 7, familyMembers: _.random(0, 500) },
  { name: 'chordoma (disease)', probands: 4, familyMembers: _.random(0, 500) },
  { name: 'neuroblastoma', probands: 6, familyMembers: _.random(0, 500) },
  { name: 'neurofibromatosis type 2', probands: 7, familyMembers: 0 },
  { name: 'neurofibromatosis type 3', probands: 7, familyMembers: 0 },
  { name: 'germinoma (disease)', probands: 6, familyMembers: 0 },
  { name: 'malignant peripheral nerve sheath tumor', probands: 5, familyMembers: 0 },
  { name: 'pineoblastoma', probands: 5, familyMembers: 0 },
  { name: 'ganglioneuroblastoma (disease)', probands: 3, familyMembers: 0 },
  { name: 'mixed neuronal-glial tumor', probands: 5, familyMembers: 0 },
  { name: 'Langerhans cell histiocytosis', probands: 4, familyMembers: 0 },
  { name: 'adenoma', probands: 4, familyMembers: 0 },
];

export const TopDiagnosesChart = withTheme(({ data, theme }) => (
  <HorizontalBar
    height={1200}
    data={topDiagnosesChartMock}
    indexBy="name"
    keys={['probands', 'familyMembers']}
    tickInterval={4}
    padding={15}
    colors={[theme.chartColors.blue, theme.chartColors.purple]}
    xTickTextLength={28}
    legends={[
      { title: 'Probands', color: theme.chartColors.blue },
      { title: 'Family Members', color: theme.chartColors.purple },
    ]}
    padding={0.7}
  />
));
