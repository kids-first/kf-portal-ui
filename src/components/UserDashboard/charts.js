import React from 'react';
import { withTheme } from 'emotion-theming';
import _ from 'lodash';

import { titleCase } from 'common/displayFormatters';
import HorizontalBar from 'chartkit/components/HorizontalBar';
import Donut from 'chartkit/components/Donut';

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

  const onClick = barData => (window.location.href = barData.data.url);

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

export const TopDiagnosesChart = withTheme(({ data, theme }) => (
  <HorizontalBar
    height={1200}
    data={data}
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

export const UserInterestsChart = withTheme(({ data, theme }) => {
  // sort by count then alpha, limit to top 10
  const sortedInterests = data
    .sort((a, b) => {
      if (a.count > b.count) return -1;
      if (a.count < b.count) return 1;
      return a.name > b.name ? 1 : -1;
    })
    .slice(0, 10)
    .map(interest => ({
      id: titleCase(interest.name),
      label: titleCase(interest.name),
      value: interest.count,
    }));

  return <Donut data={sortedInterests} colors={[theme.chartColors.red, '#FFF']} />;
});
