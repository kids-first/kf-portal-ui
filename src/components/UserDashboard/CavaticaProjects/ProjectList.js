import React, { Fragment } from 'react';
import styled from 'react-emotion';

import Row from 'uikit/Row';
import Column from 'uikit/Column';
import ExternalLink from 'uikit/ExternalLink';

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

const Task = styled('div')`
  display: inline-block;
  border-radius: 7.5px;
  margin-left: 8px;
  font-size: 12px;
  font-family: ${({ theme }) => theme.fonts.details};
  padding: 2px 4px;
  font-weight: 600;
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
      <Row mt={'10px'} pl={0}>
        <TaskBreakdown>
          Task Breakdown:{' '}
          {Object.keys(p.tasks).reduce((prev, key) => prev + p.tasks[key], 0) === 0 ? (
            <NoTasks>There are no tasks for this project yet.</NoTasks>
          ) : (
            <Fragment>
              <Task style={{ backgroundColor: '#dcfbf3', color: '#0e906f' }}>{`${
                p.tasks.completed
              } COMPLETED`}</Task>
              <Task style={{ backgroundColor: '#fbdada', color: '#a71111' }}>{`${
                p.tasks.failed
              } FAILED`}</Task>
              <Task style={{ backgroundColor: '#daecfb', color: '#1163a7' }}>{`${
                p.tasks.running
              } RUNNING`}</Task>
            </Fragment>
          )}
        </TaskBreakdown>
      </Row>
    </Project>
  ));

export default ProjectList;
