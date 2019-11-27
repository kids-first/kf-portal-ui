import React from 'react';
import Component from 'react-component-component';

import { getProjects as getCavaticaProjects, getMembers, getTasks } from 'services/cavatica';

const CavaticaProvider = ({ children, isConnected }) => {
  const refresh = ({ setState }) => async () => {
    if (!isConnected) return false;
    setState({ loading: true });
    let projects = [];
    try {
      const response = await getCavaticaProjects();
      if (response) {
        projects = response;
      }
    } catch (error) {
      setState({ projectsError: error });
    }

    const projectList = await Promise.all(
      (projects || []).map(async p => {
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
    setState({ projects: projectList, loading: false });
  };

  return (
    <Component initialState={{ loading: true, projects: null }} didMount={s => refresh(s)()}>
      {({ state, setState }) =>
        children({
          projects: state.projects,
          loading: state.loading,
          refresh: refresh({ setState }),
          projectsError: state.projectsError,
        })
      }
    </Component>
  );
};

export default CavaticaProvider;
