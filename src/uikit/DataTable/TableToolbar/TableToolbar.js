import React from 'react';

import { Toolbar, PaginationStatus, ToolbarGroup } from './styles';

const TableToolbar = ({ page = 0, pageSize = 0, total = 0, children }) => {
  const childrenLength = React.Children.count(children);

  return (
    <Toolbar>
      <PaginationStatus>
        {`Showing ${(page * pageSize + 1).toLocaleString()} - ${Math.min(
          (page + 1) * pageSize,
          total,
        ).toLocaleString()} of ${total.toLocaleString()}`}
      </PaginationStatus>
      <ToolbarGroup>
        {React.Children.map(children, (child, i) => {
          const styling = { borderRadiusLeft: i == 0, borderRadiusRight: i === childrenLength - 1 };
          return React.cloneElement(child, styling);
        })}
      </ToolbarGroup>
    </Toolbar>
  );
};

export default TableToolbar;
