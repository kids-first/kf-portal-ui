import * as React from 'react';
import ControlledDataTable from '../../../../uikit/DataTable/ControlledDataTable';

const ParticipantDataTable = ({ columns, data }) => {
  columns.forEach(col => {
    if (typeof col.Cell === 'undefined')
      col.Cell = wrapper => <div style={{ textTransform: 'capitalize' }}>{wrapper.value}</div>;
  });

  return (
    <ControlledDataTable
      loading={false}
      columns={columns}
      data={data}
      dataTotalCount={-1}
      onFetchData={() => null}
      showPagination={false}
      style={{padding: 0}}
    />
  );
};

export default ParticipantDataTable;
