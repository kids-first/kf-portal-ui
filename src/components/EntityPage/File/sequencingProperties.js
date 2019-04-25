import _ from 'lodash';

export const hasSequencingReadProperties = data => {
  return _.get(data, 'sequencing_experiments.hits.edges[0].node', null) !== null;
};

export const toSequencingReadProperties = data => {
  const experiments = _.get(data, 'sequencing_experiments.hits.edges[0].node');

  if (!experiments) return [];

  const {
    max_insert_size: maxInsertSize,
    total_reads: totalReads,
    mean_depth: meanDepth,
    mean_insert_size: meanInsertSize,
    mean_read_length: meanReadLength,
  } = experiments;

  return [
    { description: 'Total Reads', value: totalReads },
    { description: 'Max Insert Size', value: maxInsertSize },
    { description: 'Mean Depth', value: meanDepth },
    { description: 'Mean Insert Size', value: meanInsertSize },
    { description: 'Mean Read Length', value: meanReadLength },
  ];
};
