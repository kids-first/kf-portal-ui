import * as React from 'react';
import { Result, Spin } from 'antd';
import { injectState } from 'freactal';
import { compose, lifecycle, withState } from 'recompose';

import CheckIcon from 'icons/CircleCheckIcon';
import { getProjects as getCavaticaProjects } from 'services/cavatica';
import theme from 'theme/defaultTheme';
import { Box, Paragraph } from 'uikit/Core';
import { FilterInput } from 'uikit/Input';
import { TableHeader } from 'uikit/Table';
import { getMsgFromErrorOrElse } from 'utils';

import CavaticaAddProject from './CavaticaAddProject';

import './cavatica.css';

const enhance = compose(
  injectState,
  withState('isLoadingProjects', 'setIsLoadingProject', false),
  withState('projectSearchValue', 'setProjectSearchValue', ''),
  withState('projectList', 'setProjectList', []),
  withState('selectedProject', 'setSelectedProject', null),
  withState('errorFetchingProjects', 'setErrorFetchingProjects', null),
  lifecycle({
    async componentDidMount() {
      const { setProjectList, setIsLoadingProject, setErrorFetchingProjects } = this.props;

      setIsLoadingProject(true);
      try {
        const projects = await getCavaticaProjects();
        setProjectList(projects);
      } catch (error) {
        setErrorFetchingProjects(error);
      } finally {
        setIsLoadingProject(false);
      }
    },
  }),
);

//eslint-disable-next-line: not fixed since I could not test the component properly + ...props

const CavaticaProjects = ({
  projectSearchValue,
  setProjectSearchValue,
  projectList,
  setProjectList,
  selectedProject,
  setSelectedProject,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addingProject,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setAddingProject,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getGen3Ids,
  isLoadingProjects,
  onSelectProject,
  errorFetchingProjects,
  ...props
}) => {
  if (errorFetchingProjects) {
    return (
      <Result
        style={{ width: '100%' }}
        status="error"
        title={getMsgFromErrorOrElse(errorFetchingProjects)}
      />
    );
  }

  return (
    <div className="cavaticaProjectsContainer">
      <div className="header">
        <TableHeader>Cavatica Projects:</TableHeader>{' '}
        {
          <Box position="relative">
            <FilterInput
              value={projectSearchValue}
              placeholder="Search projects"
              onChange={(e) => {
                setProjectSearchValue(e.target.value);
              }}
            />
          </Box>
        }
      </div>
      <div className="body">
        {isLoadingProjects && <Spin />}
        {!isLoadingProjects && Array.isArray(projectList) && projectList.length > 0 && (
          <div className="projectSelector" onChange={() => {}}>
            {projectList
              .filter((project) => {
                if (project.id === selectedProject) return true;
                return projectSearchValue !== '' ? project.name.includes(projectSearchValue) : true;
              })
              .map((project) => {
                const selected = selectedProject === project.id;
                return (
                  <div
                    key={project.id}
                    className={`projectOption ${selected ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedProject(project.id);
                      onSelectProject(project);
                    }}
                  >
                    <div className="checkSymbol">
                      {selected && <CheckIcon width={14} height={14} fill={theme.active} />}
                    </div>
                    <Paragraph>{project.name}</Paragraph>
                  </div>
                );
              })}
          </div>
        )}
      </div>
      <div className="footer">
        <CavaticaAddProject
          setSelectedProject={(p) => {
            setSelectedProject(p.id);
            onSelectProject(p);
          }}
          onSuccess={() => {
            getCavaticaProjects().then((projects) => {
              setProjectList(projects);
            });
          }}
          {...props}
        />
      </div>
    </div>
  );
};

export default enhance(CavaticaProjects);
