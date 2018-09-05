import React, { Fragment } from 'react';
import styled from 'react-emotion';

import { Link } from 'uikit/Core';
import QueryBlock from './QueryBlock';
//import { TealActionButton } from 'uikit/Button';

const DefaultSavedQueries = ({ queries }) => (
  <Fragment>
    <div>
      {queries.filter(q => q.content.example).map(q => {
        q.link = `/search${q.content.longUrl.split('/search')[1]}`;
        return <QueryBlock key={q.id} query={q} savedTime={false} />;
      })}
    </div>
  </Fragment>
);
export default DefaultSavedQueries;
