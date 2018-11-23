import React from 'react';
import Component from 'react-component-component';

import { getProjects as getCavaticaProjects, getMembers, getTasks } from 'services/cavatica';

const CavaticaProvider = ({ children, onData }) => (
  <Component
    initialState={{ loading: true, projects: null }}
    didMount={async ({ setState }) => {
      const projects = await getCavaticaProjects();
      onData(projects);

      const projectList = await Promise.all(
        projects.map(async p => {
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
    }}
  >
    {({ state }) => children(state)}
  </Component>
);

export default CavaticaProvider;
