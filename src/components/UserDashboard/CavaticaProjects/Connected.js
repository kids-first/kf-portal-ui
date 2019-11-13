import React from 'react';

import Column from 'uikit/Column';
import { Box } from 'uikit/Core';
import CardContentSpinner from 'uikit/Card/CardContentSpinner';
import ProjectList from './ProjectList';
import NoProjects from './NoProjects';

const Connected = ({ loading, projects, tabToCreate }) => {
  return loading ? (
    <CardContentSpinner />
  ) : (
    <Column>
      {projects && projects.length > 0 ? (
        <ProjectList projects={projects} />
      ) : (
        <Box mt={20}>
          <NoProjects tabToCreate={tabToCreate} />
        </Box>
      )}
    </Column>
  );
};

export default Connected;
