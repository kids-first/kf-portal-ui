import React from 'react';
import Plot from 'react-plotly.js';

//FIXME: this is only poc for a demo.

const mock = {
  labels: [
    'All (HP:0000001)',
    'Phenotypic abnormality (HP:0000118)',
    'Abnormality of the nervous system (HP:0000707)',
    'Abnormality of the eye (HP:0000478)',
    'Abnormality of nervous system physiology (HP:0012638)',
    'Seizures (HP:0001250)',
    'Neurodevelopmental abnormality (HP:0012759)',
    'Behavioral abnormality (HP:0000708)',
    'Neurodevelopmental delay (HP:0012758)',
    'Global developmental delay (HP:0001263)',
    'Autistic behavior (HP:0000729)',
  ],
  parents: [
    '',
    'All (HP:0000001)',
    'Phenotypic abnormality (HP:0000118)',
    'Phenotypic abnormality (HP:0000118)',
    'Abnormality of the nervous system (HP:0000707)',
    'Abnormality of nervous system physiology (HP:0012638)',
    'Abnormality of nervous system physiology (HP:0012638)',
    'Abnormality of nervous system physiology (HP:0012638)',
    'Neurodevelopmental abnormality (HP:0012759)',
    'Neurodevelopmental delay (HP:0012758)',
    'Behavioral abnormality (HP:0000708)',
  ],
  values: [492, 492, 420, 134, 353, 152, 46, 19, 46, 46, 19],
};

const data = [
  {
    type: 'sunburst',
    ...mock,
    outsidetextfont: { size: 30, color: '#377eb8' },
    leaf: { opacity: 0.4 },
    marker: { line: { width: 4 } },
  },
];

export const Sunburst = () => (
  <Plot
    data={data}
    style={{ width: '98%', height: '100%' }}
    layout={{ margin: { l: 0, r: 0, b: 0, t: 0 } }}
    config={{ displaylogo: false, responsive: true, displayModeBar: false }}
  />
);
