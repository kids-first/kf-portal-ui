import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { getMembers, getProjects as getCavaticaProjects, getTasks } from 'services/cavatica';

const CavaticaProvider = ({ children, isConnected }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState(null);
  const [projectsError, setProjectsError] = useState(null);

  const refresh = async () => {
    if (!isConnected) return false;
    setIsLoading(true);

    let projects = [];
    try {
      const response = await getCavaticaProjects();
      if (response) {
        projects = response;
      }
    } catch (error) {
      setProjectsError(error);
    }

    const projectList = await Promise.all(
      (projects || []).map(async (p) => {
        const [members, completedTasks, failedTasks, runningTasks] = await Promise.all([
          getMembers({ project: p.id }),
          getTasks({ project: p.id, type: 'COMPLETED' }),
          getTasks({ project: p.id, type: 'FAILED' }),
          getTasks({ project: p.id, type: 'RUNNING' }),
        ]);

        const tasks = {
          completed: completedTasks.items.length,
          failed: failedTasks.items.length,
          running: runningTasks.items.length,
        };

        return { ...p, members: members.items.length, tasks };
      }),
    );

    setProjects(projectList);
    setIsLoading(false);
  };

  useEffect(() => {
    refresh();
  });

  return <>{children({ projects, loading: isLoading, refresh, projectsError })}</>;
};

CavaticaProvider.propTypes = {
  isConnected: PropTypes.bool,
  children: PropTypes.func.isRequired,
};

export default CavaticaProvider;
