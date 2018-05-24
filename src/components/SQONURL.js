import React from 'react';
import { Route } from 'react-router-dom';
import { parse, stringify } from 'query-string';
import { addSqonHistory } from 'services/usersnap';

export default props => (
  <Route>
    {p => {
      let search = parse(p.location.search);
      if (search.sqon) search.sqon = JSON.parse(search.sqon);
      return props.render({
        sqon: search.sqon,
        setSQON: sqon => {
          addSqonHistory(sqon);
          p.history.push({
            ...p.location,
            search: stringify({ ...search, sqon: JSON.stringify(sqon) }),
          });
        },
      });
    }}
  </Route>
);
