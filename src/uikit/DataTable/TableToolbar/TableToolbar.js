import React from 'react';

import Row from 'uikit/Row';

import './TableToolbar.css';

const TableToolbar = ({ page = 0, pageSize = 0, total = 0, children }) => {
  return (
    <Row className="tableToolbar-toolbar">
      <div className="pagination-status">
        {`Showing ${(page * pageSize + 1).toLocaleString()} - ${Math.min(
          (page + 1) * pageSize,
          total,
        ).toLocaleString()} of ${total.toLocaleString()}`}
      </div>
      <Row>{children}</Row>
    </Row>
  );
};

export default TableToolbar;
