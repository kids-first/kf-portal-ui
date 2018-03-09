import * as React from 'react';
import { compose, lifecycle, withState } from 'recompose';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';
import styled from 'react-emotion';

import {
  getProjects as getCavaticaProjects,
  convertGen3FileIds,
  copyFiles as copyCavaticaFiles,
} from 'services/cavatica';
import { getFilesById } from 'services/arranger';

import cavaticaLogo from 'assets/logomark-cavatica.svg';
import PlusIcon from 'icons/PlusCircleIcon';
import ExternalLink from 'uikit/ExternalLink';
import DoubleArrowRight from 'icons/DoubleChevronRightIcon';

const getGen3UUIDs = async arrangerIds => {
  const fileData = await getFilesById({ ids: arrangerIds, fields: ['uuid'] });
  return fileData.map(file => file.node.uuid);
};

const enhance = compose(
  injectState,
  withTheme,
  withState('projectSearchValue', 'setProjectSearchValue', ''),
  withState('projectList', 'setProjectList', []),
  withState('selectedProject', 'setSelectedProject', null),
  lifecycle({
    async componentDidMount() {
      const { setProjectList } = this.props;

      getCavaticaProjects().then(projects => {
        setProjectList(projects);
      });
    },
  }),
);

const ProjectSelector = styled.select`
  border: none;
  overflow-y: auto;
  overflow-x: none;

  option {
    font-size: 1.4em;
    padding: 3px;
    padding-left: 15px;
    color: ${props => props.theme.primary};
  }
  option:checked {
    background-color: ${props => props.theme.optionSelected};
    color: yellow;
  }
  option:hover {
    background-color: ${props => props.theme.optionSelected};
    color: black !important;
  }
`;

const NiceWhiteButton = styled.button`
  border-radius: 19px;
  background-color: #ffffff;
  border: solid 1px #cacbcf;
  font-size: 11px;
  letter-spacing: 0.2px;
  color: ${props => props.theme.tertiary};
  padding: 5px 18px 5px 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  font-weight: bold;
  cursor: pointer;

  :disabled {
    cursor: default;
    color: ${props => props.theme.greyScale2}
    background-color: ${props => props.theme.greyScale5}
  }
`;

const CavaticaProjects = ({
  effects: { setToast, closeToast },
  theme,
  projectSearchValue,
  setProjectSearchValue,
  projectList,
  setProjectList,
  selectedProject,
  setSelectedProject,
  addingProject,
  setAddingProject,
  getGen3Ids,
  ...props
}) => {
  return (
    <div css={props.styles}>
      <div className="wrapper">
        <div className="header">
          <div css="margin-top:3px;">
            <span>Select your project:</span>
          </div>
          <div css="margin-left:9px;">
            <button
              className="niceWhiteButton"
              onClick={() => {
                if (typeof props.onAddProject === 'function') props.onAddProject();
              }}
            >
              <div className="verticalCenter">
                <PlusIcon
                  fill={theme.tertiary}
                  width="14px"
                  height="14px"
                  css="margin-right: 7px;"
                />
              </div>
              <div>New Project</div>
            </button>
          </div>
        </div>
        <div className="body">
          <input
            className="textInput"
            id="cavaticaProjectSearch"
            type="text"
            value={projectSearchValue}
            name="cavaticaProjectSearch"
            placeholder="Search projects"
            onChange={e => {
              setProjectSearchValue(e.target.value);
            }}
          />
          <ProjectSelector
            size="6"
            onChange={e => {
              setSelectedProject(e.target.value);
            }}
          >
            {projectList.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </ProjectSelector>
        </div>
        <div className="footer">
          <NiceWhiteButton
            css="width:100%;"
            disabled={!selectedProject || props.selectedTableRows.length === 0}
            onClick={async () => {
              // Convert arranger IDs to Gen3 UUIDs
              const uuids = await getGen3UUIDs(props.selectedTableRows);
              // alert(`Gen3 UUIDs: ${uuids}`);

              // Convert Gen3 UUIDs to CavaticaIds
              const conversionResponse = await convertGen3FileIds({ ids: uuids });
              const cavaticaIds = conversionResponse.map(item => item.id);
              // alert(`Cavatica IDs: ${cavaticaIds}`);

              // Copy Files
              copyCavaticaFiles({
                project: selectedProject,
                ids: cavaticaIds,
              }).then(r => {
                setToast({
                  id: `${Date.now()}`,
                  action: 'success',
                  component: (
                    <div
                      css={`
                        display: flex;
                      `}
                    >
                      <div
                        css={`
                          display: flex;
                          flex-direction: column;
                        `}
                      >
                        <div
                          css={`
                            font-size: 16px;
                          `}
                        >
                          Success!
                        </div>
                        <div>Files were copied to your Cavatica project:</div>
                        <div
                          css={`
                            color: ${theme.secondary};
                            margin-bottom: 20px;
                          `}
                        >
                          {projectList.filter(item => item.id === selectedProject)[0].name}
                        </div>
                        <ExternalLink
                          css={`
                            font-size: 14px;
                          `}
                          href={`https://kids-first-vayu.sbgenomics.com/u/${selectedProject}`}
                        >
                          Open project in Cavatica
                          <DoubleArrowRight
                            fill={theme.primary}
                            width="10px"
                            css="margin-left:4px;"
                          />
                        </ExternalLink>
                      </div>
                    </div>
                  ),
                });
                // alert(`Copy Response: ${JSON.stringify(r)}`);
              });
            }}
          >
            <div className="verticalCenter">
              <img
                alt=""
                src={cavaticaLogo}
                css={`
                  width: 28px;
                  height: 28px;
                  margin-right: 7px;
                `}
              />
            </div>
            <div>Copy files to Cavatica project</div>
          </NiceWhiteButton>
        </div>
      </div>
    </div>
  );
};

export default enhance(CavaticaProjects);
