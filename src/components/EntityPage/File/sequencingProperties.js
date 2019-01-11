export const toSequencingReadProperties = data => {
  const experiments = data.sequencing_experiments.hits.edges[0].node;

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
