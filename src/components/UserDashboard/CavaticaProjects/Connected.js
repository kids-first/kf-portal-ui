import React from 'react';
import PropTypes from 'prop-types';
import Column from 'uikit/Column';
import { Box } from 'uikit/Core';
import ProjectList from './ProjectList';
import NoProjects from './NoProjects';
import { Spinner } from 'uikit/Spinner';

const Connected = ({ loading, projects, tabToCreate }) =>
  loading ? (
    <Spinner size={'large'} />
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

Connected.propTypes = {
  loading: PropTypes.bool,
  projects: PropTypes.array,
  tabToCreate: PropTypes.func,
};

export default Connected;
