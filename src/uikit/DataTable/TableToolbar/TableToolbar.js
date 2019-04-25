import React from 'react';

import { Toolbar, PaginationStatus, ToolbarGroup } from './styles';

const TableToolbar = ({ page = 0, pageSize = 0, total = 0, children }) => {
  return (
    <Toolbar>
      <PaginationStatus>
        {`Showing ${(page * pageSize + 1).toLocaleString()} - ${Math.min(
          (page + 1) * pageSize,
          total,
        ).toLocaleString()} of ${total.toLocaleString()}`}
      </PaginationStatus>
      <ToolbarGroup>{children}</ToolbarGroup>
    </Toolbar>
  );
};

export default TableToolbar;
