import React from 'react';
import styled from 'react-emotion';

import Row from 'uikit/Row';
import Column from 'uikit/Column';

const Project = styled(Column)`
  justify-content: center;
`;

const Members = styled('div')`
  font-family: ${({ theme }) => theme.fonts.details};
  font-size: 13px;
  color: #74757d;
`;

const getTasks = tasks =>
  tasks.map(t => {
    switch (t.type) {
      case 'FAILED':
        <Task color="">{t.amount + ' FAILED'}</Task>;
        break;
      case 'COMPLETED':
        <Task color="">{t.amount + ' COMPLETED'}</Task>;

        break;
      case 'RUNNING':
        <Task color="">{t.amount + ' RUNNING'}</Task>;

        break;
    }
  });

const ProjectList = ({ projects }) => {
  console.log('projects', projects);
  return projects.map(p => (
    <Project>
      <Row justifyContent="space-between" pl={0}>
        <a href>{p.name}</a>
        <Members>{p.members}</Members>
      </Row>
      <Row pl={0}>
        Task Breakdown:{' '}
        {/*!tasks ? 'There are no tasks for this project yet.' : getTasks(p.tasks)*/}
      </Row>
    </Project>
  ));
};

export default ProjectList;
