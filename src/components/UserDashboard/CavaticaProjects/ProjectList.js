import React from 'react';

import Row from 'uikit/Row';
import Column from 'uikit/Column';
import ExternalLink from 'uikit/ExternalLink';
import { getTaskLink } from 'services/cavatica';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';

import {
  projectItem,
  members,
  projectLink,
  task,
  tasksBreakdown,
} from './CavaticaProjects.module.css';

const Task = ({ tasks, status, projectId, ...props }) => {
  const text = `${tasks} ${status}`;

  return tasks > 0 ? (
    <a
      href={getTaskLink({ project: projectId, status: status })}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {text}
    </a>
  ) : (
    <span {...props}>{text}</span>
  );
};

export default ({ projects }) =>
  projects.map((p, i) => (
    <Column className={projectItem} key={i}>
      <Row justifyContent="space-between" pl={0}>
        <ExternalLink
          className={projectLink}
          onClick={() => {
            trackUserInteraction({
              category: TRACKING_EVENTS.categories.integration.cavatica,
              action: `Project Link ${TRACKING_EVENTS.actions.click}`,
              label: p.name,
            });
          }}
          href={`https://cavatica.sbgenomics.com/u/${p.id}`}
          iconSize={11}
        >
          {p.name}
        </ExternalLink>
        <div>
          <div className={members}>
            <span>{p.members}</span>
            {`${p.members > 1 ? ' people' : ' person'}`}
          </div>
        </div>
      </Row>
      {Object.keys(p.tasks).reduce((prev, key) => prev + p.tasks[key], 0) === 0 ? null : (
        <Row mt={'10px'} pl={0}>
          <div className={tasksBreakdown}>
            Task Breakdown:{' '}
            <Task
              tasks={p.tasks.completed}
              projectId={p.id}
              status="COMPLETED"
              className={`${task} completed`}
            />
            <Task
              tasks={p.tasks.failed}
              projectId={p.id}
              status="FAILED"
              className={`${task} failed`}
            />
            <Task
              tasks={p.tasks.running}
              projectId={p.id}
              status="RUNNING"
              className={`${task} running`}
            />
          </div>
        </Row>
      )}
    </Column>
  ));
