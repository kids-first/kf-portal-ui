import React from 'react';

import Row from 'uikit/Row';
import Column from 'uikit/Column';
import ExternalLink from 'uikit/ExternalLink';
import { getTaskLink } from 'services/cavatica';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';

import './CavaticaProjects.css';

const Task = ({ tasks, status, projectId, displayStyle = '' }) => {
  const text = `${tasks} ${status}`;

  return tasks > 0 ? (
    <a
      className={`task taskLink ${displayStyle}`}
      href={getTaskLink({ project: projectId, status: status })}
      target="_blank"
      rel="noopener noreferrer"
    >
      {text}
    </a>
  ) : (
    <span className={`task ${displayStyle}`}>{text}</span>
  );
};

const ProjectList = ({ projects }) =>
  projects.map((p, i) => (
    <Column className="cavaticaProjects" key={i}>
      <Row className="cavaticaProjectsProject">
        <ExternalLink
          className="link"
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
          <div className="members">
            <span className="membersCount">{p.members}</span>
            {`${p.members > 1 ? ' people' : ' person'}`}
          </div>
        </div>
      </Row>
      {Object.keys(p.tasks).reduce((prev, key) => prev + p.tasks[key], 0) === 0 ? null : (
        <Row className="cavaticaProjectsTasks">
          <div className="taskBreakdown">
            Task Breakdown:{' '}
            <Task
              tasks={p.tasks.completed}
              projectId={p.id}
              status="COMPLETED"
              displayStyle="completed"
            />
            <Task tasks={p.tasks.failed} projectId={p.id} status="FAILED" displayStyle="failed" />
            <Task
              tasks={p.tasks.running}
              projectId={p.id}
              status="RUNNING"
              displayStyle="running"
            />
          </div>
        </Row>
      )}
    </Column>
  ));

export default ProjectList;
