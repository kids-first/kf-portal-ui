import React, { Fragment } from 'react';
import styled, { css } from 'react-emotion';

import Row from 'uikit/Row';
import Column from 'uikit/Column';
import ExternalLink from 'uikit/ExternalLink';
import { getTaskLink } from 'services/cavatica';

const Project = styled(Column)`
  justify-content: center;
  margin: 0;
  padding: 10px 10px 10px 0;
  padding-bottom: 16px;
  border-bottom: solid 1px ${({ theme }) => theme.greyScale5};
`;

const Members = styled('div')`
  font-family: ${({ theme }) => theme.fonts.details};
  font-size: 12px;
  color: #74757d;
`;

const MemberCount = styled('span')`
  font-size: 12px;
  color: #343434;
  font-family: ${({ theme }) => theme.fonts.details};
`;

const Link = styled(ExternalLink)`
  text-decoration: underline;
  font-size: 14px;
  font-family: ${({ theme }) => theme.fonts.details};
  font-weight: 600;
`;

const taskStyle = props => css`
  display: inline-block;
  border-radius: 7.5px;
  margin-left: 8px;
  font-size: 12px;
  font-family: ${props.theme.fonts.details};
  padding: 2px 5px;
  font-weight: 600;
`;

const completedTaskStyle = props =>
  css`
    background-color: #dcfbf3;
    color: #0e906f;
  `;

const runningTaskStyle = props =>
  css`
    background-color: #daecfb;
    color: #1163a7;
  `;

const failedTaskStyle = props =>
  css`
    background-color: #fbdada;
    color: #a71111;
  `;

const TaskLink = styled('a')`
  ${taskStyle};
  ${props => props.displayStyle};
  text-decoration: none;
`;

const TaskSpan = styled('span')`
  ${taskStyle};
  ${props => props.displayStyle};
`;

const TaskBreakdown = styled('div')`
  font-size: 12px;
  font-family: ${({ theme }) => theme.fonts.details};
  font-weight: 600;
`;

const NoTasks = styled('span')`
  font-size: 12px;
  font-family: ${({ theme }) => theme.fonts.details};
  font-weight: normal;
`;

const Task = ({ tasks, status, projectId, ...props }) => {
  const text = `${tasks} ${status}`;

  return tasks > 0 ? (
    <TaskLink href={getTaskLink({ project: projectId, status: status })} target="_blank" {...props}>
      {text}
    </TaskLink>
  ) : (
    <TaskSpan {...props}>{text}</TaskSpan>
  );
};

const ProjectList = ({ projects }) =>
  projects.map((p, i) => (
    <Project key={i}>
      <Row justifyContent="space-between" pl={0}>
        <Link href={`https://cavatica.sbgenomics.com/u/${p.id}`} iconSize={11}>
          {p.name}
        </Link>
        <div>
          <Members>
            <MemberCount>{p.members}</MemberCount>
            {`${p.members > 1 ? ' people' : ' person'}`}
          </Members>
        </div>
      </Row>
      {Object.keys(p.tasks).reduce((prev, key) => prev + p.tasks[key], 0) === 0 ? null : (
        <Row mt={'10px'} pl={0}>
          <TaskBreakdown>
            Task Breakdown:{' '}
            <Task
              tasks={p.tasks.completed}
              projectId={p.id}
              status="COMPLETED"
              displayStyle={completedTaskStyle}
            />
            <Task
              tasks={p.tasks.failed}
              projectId={p.id}
              status="FAILED"
              displayStyle={failedTaskStyle}
            />
            <Task
              tasks={p.tasks.running}
              projectId={p.id}
              status="RUNNING"
              displayStyle={runningTaskStyle}
            />
          </TaskBreakdown>
        </Row>
      )}
    </Project>
  ));

export default ProjectList;
