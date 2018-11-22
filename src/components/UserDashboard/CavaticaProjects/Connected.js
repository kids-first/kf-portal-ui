import React from 'react';

import LoadingSpinner from 'uikit/LoadingSpinner';
import Column from 'uikit/Column';

import ProjectList from './ProjectList';
import NoProjects from './NoProjects';
import { CardContentSpinner } from '../styles';

const Connected = ({ loading, projects }) => {
  return loading ? (
    <CardContentSpinner />
  ) : (
    <Column>
      {projects && projects.length > 0 ? <ProjectList projects={projects} /> : <NoProjects />}
    </Column>
  );
};

export default Connected;
