import React from 'react';
import ControlledDataTable from 'uikit/DataTable/ControlledDataTable';
import { NCITLink, MONDOLink } from '../../Utils/DiagnosisAndPhenotypeLinks';
import PropTypes from 'prop-types';

const cellBreak = wrapper => (
  <div style={{ wordBreak: 'break-word', textTransform: 'capitalize' }}>{wrapper.value}</div>
);

const generateColumns = () => {
  return [
    {
      Header: 'Diagnosis Category',
      accessor: 'diagnosis_category',
      Cell: cellBreak,
    },
    {
      Header: 'Diagnosis (Mondo)',
      accessor: 'mondo_id_diagnosis',
      Cell: wrapper =>
        wrapper.value === '--' ? <div>--</div> : <MONDOLink mondo={wrapper.value} />,
    },
    {
      Header: 'Diagnosis (NCIT)',
      accessor: 'ncit_id_diagnosis',
      Cell: wrapper => (wrapper.value === '--' ? <div>--</div> : <NCITLink ncit={wrapper.value} />),
    },
    {
      Header: 'Diagnosis (Source Text)',
      accessor: 'source_text_diagnosis',
      Cell: cellBreak,
    },
    {
      Header: 'Age at event',
      accessor: 'age_at_event_days',
      Cell: cellBreak,
    },
  ];
};

const HistolocalDiagnosesTable = props => {
  const { data = [] } = props;

  if (data.length === 0) {
    return null;
  }

  return (
    <ControlledDataTable
      loading={false}
      columns={generateColumns()}
      data={data}
      dataTotalCount={-1}
      onFetchData={() => null}
      showPagination={false}
      style={{ padding: 0 }}
    />
  );
};

HistolocalDiagnosesTable.propTypes = {
  data: PropTypes.array.isRequired,
};

export default HistolocalDiagnosesTable;
