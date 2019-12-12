import React from 'react';

import Column from 'uikit/Column';
import { Box } from 'uikit/Core';
import ChartContentSpinner from 'components/Charts/ChartContentSpinner';
import ProjectList from './ProjectList';
import NoProjects from './NoProjects';

const Connected = ({ loading, projects, tabToCreate }) => {
  return loading ? (
    <ChartContentSpinner />
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
