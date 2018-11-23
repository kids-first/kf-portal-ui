import React from 'react';
import Component from 'react-component-component';

import { getProjects as getCavaticaProjects, getMembers, getTasks } from 'services/cavatica';

const CavaticaProvider = ({ children, onData }) => (
  <Component
    initialState={{ loading: true, projects: null }}
    didMount={async ({ setState }) => {
      const projects = await getCavaticaProjects();
      onData(projects);

      const projectsWithData = await projects.map(async p => {
        const members = await getMembers({ project: p.id });
        const completedTasks = await getTasks({ project: p.id, type: 'COMPLETED' });
        const failedTasks = await getTasks({ project: p.id, type: 'FAILED' });
        const runningTasks = await getTasks({ project: p.id, type: 'RUNNING' });

        const tasks = {
          completed: completedTasks.items.length,
          failed: failedTasks.items.length,
          running: runningTasks.items.length,
        };

        return { ...p, members: members.items.length, tasks };
      });

      Promise.all(projectsWithData).then(projectList => {
        setState({ projects: projectList, loading: false });
      });
    }}
  >
    {({ state }) => children(state)}
  </Component>
);

export default CavaticaProvider;
