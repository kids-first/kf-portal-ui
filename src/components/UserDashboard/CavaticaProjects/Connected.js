import React from 'react';

import LoadingSpinner from 'uikit/LoadingSpinner';
import Column from 'uikit/Column';

import ProjectList from './ProjectList';
import NoProjects from './NoProjects';

const Connected = ({ loading, projects }) => {
  return loading ? (
    <LoadingSpinner />
  ) : (
    <Column>
      {projects && projects.length > 0 ? <ProjectList projects={projects} /> : <NoProjects />}
    </Column>
  );
};

export default Connected;
