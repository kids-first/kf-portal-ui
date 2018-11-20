import React, { Fragment } from 'react';
import styled from 'react-emotion';

import Row from 'uikit/Row';
import Column from 'uikit/Column';
import ExternalLink from 'uikit/ExternalLink';

const Project = styled(Column)`
  justify-content: center;
  margin: 10px 0;
  padding-bottom: 16px;
  &:not(:last-child) {
    border-bottom: solid 1px ${({ theme }) => theme.borderGrey};
  }
`;

const Members = styled('div')`
  font-family: ${({ theme }) => theme.fonts.details};
  font-size: 13px;
  color: #74757d;
`;

const MemberCount = styled('span')`
  font-size: 13px;
  color: #343434;
  font-family: ${({ theme }) => theme.fonts.details};
`;

const Link = styled(ExternalLink)`
  text-decoration: underline;
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

const ProjectList = ({ projects }) => {
  return projects.map((p, i) => (
    <Project key={i}>
      <Row justifyContent="space-between" pl={0}>
        <Link href={p.href}>{p.name}</Link>
        <div>
          <Members>
            <MemberCount>{p.members}</MemberCount>
            {`${p.members.length > 1 ? ' people' : ' person'}`}
          </Members>
        </div>
      </Row>
      <Row mt={'10px'} pl={0}>
        <TaskBreakdown>
          Task Breakdown:{' '}
          {Object.keys(p.tasks).reduce((prev, key) => prev + p.tasks[key], 0) === 0 ? (
            <span style={{ fontWeight: 'normal' }}>There are no tasks for this project yet.</span>
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
};

export default ProjectList;
