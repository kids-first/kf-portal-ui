import { format } from 'date-fns';
import { pickData } from './utils';

export const experimentalStrategiesColumns = [
  { Header: 'Experimental Strategy', accessor: 'experiment_strategy' },
  { Header: 'External ID', accessor: 'external_id' },
  { Header: 'Experiment Date', accessor: 'experiment_date' },
  { Header: 'Instrument Model', accessor: 'instrument_model' },
  { Header: 'Platform', accessor: 'platform' },
  { Header: 'Library Name', accessor: 'library_name' },
  { Header: 'Library Strand', accessor: 'library_strand' },
];

export const toExperimentalStrategiesData = data =>
  data.sequencing_experiments.hits.edges.map(seq => {
    const se = seq.node;
    return {
      experiment_strategy: pickData(se, 'experiment_strategy'),
      external_id: pickData(se, 'external_id'),
      experiment_date: pickData(se, 'experiment_date')==="--" ? "--" : pickData(se, 'experiment_date', d => format(d, 'YYYY-MM-DD')),
      instrument_model: pickData(se, 'instrument_model'),
      platform: pickData(se, 'platform'),
      library_name: pickData(se, 'library_name'),
      library_strand: pickData(se, 'library_strand'),
    };
  });
