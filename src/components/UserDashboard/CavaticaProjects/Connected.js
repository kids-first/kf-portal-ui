import React from 'react';
import PropTypes from 'prop-types';
import Column from 'uikit/Column';
import { Box } from 'uikit/Core';
import ProjectList from './ProjectList';
import NoProjects from './NoProjects';
import { Spinner } from 'uikit/Spinner';
import { projectsListWrapper, projectsListSpinner } from '../UserDashboard.module.css';

const Connected = ({ loading, projects, tabToCreate }) => {
  if (loading) {
    return <Spinner className={projectsListSpinner} size={'large'} />;
  }

  const hasProjects = projects && projects.length > 0;
  if (hasProjects) {
    return (
      <Column className={projectsListWrapper} scrollY>
        <ProjectList projects={projects} />
      </Column>
    );
  }

  return (
    <Column>
      <Box mt={20}>
        <NoProjects tabToCreate={tabToCreate} />
      </Box>
    </Column>
  );
};

Connected.propTypes = {
  loading: PropTypes.bool,
  projects: PropTypes.array,
  tabToCreate: PropTypes.func,
};

export default Connected;
