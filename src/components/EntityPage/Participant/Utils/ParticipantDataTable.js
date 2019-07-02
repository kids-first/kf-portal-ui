import * as React from "react";
import ControlledDataTable from '../../../../uikit/DataTable/ControlledDataTable';

const ParticipantDataTable = ({columns, data}) => {
  return <ControlledDataTable loading={false} columns={columns} data={data} dataTotalCount={-1} onFetchData={() => null} showPagination={false}/>
};

export default ParticipantDataTable;