import * as React from 'react';
import { compose, lifecycle, withState } from 'recompose';
import { withTheme } from 'emotion-theming';

import { css } from 'emotion';
import styled from 'react-emotion';
import { injectState } from 'freactal';

import { getProjects as getCavaticaProjects } from 'services/cavatica';

import cavaticaLogo from 'assets/logomark-cavatica.svg';
import PlusIcon from 'icons/PlusCircleIcon';

const enhance = compose(
  injectState,
  withTheme,
  withState('projectSearchValue', 'setProjectSearchValue', ''),
  withState('projectList', 'setProjectList', []),
  lifecycle({
    async componentDidMount() {
      const { setProjectList } = this.props;

      getCavaticaProjects().then(projects => {
        setProjectList(projects);
      });

      // loggedInUser && egoId === loggedInUser.egoId
      //   ? setProfile(loggedInUser)
      //   : setProfile(await getProfile({ egoId }));
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

  :hover {
    cursor: pointer;
  }
`;

const styles = css`
  border-radius: 10px;
  background-color: #ffffff;
  border: solid 1px #cacbcf;

  input:focus,
  select:focus,
  textarea:focus,
  button:focus {
    outline: none;
  }

  .header {
    display: flex;
    padding: 5px;
    border-bottom: solid 1px #cacbcf;
    justify-content: space-between;
  }

  .body {
    border-bottom: solid 1px #cacbcf;
    display: flex;
    flex-direction: column;
  }

  .projectSearchInput {
    border-radius: 10px;
    background-color: #ffffff;
    border: solid 1px #cacbcf;
    padding: 5px;
    font-size: 1em;
    margin: 10px;
    margin-bottom: 0px;
  }

  .footer {
    padding: 10px;
  }
`;

const CavaticaProjects = ({
  state,
  theme,
  projectSearchValue,
  setProjectSearchValue,
  projectList,
  setProjectList,
  ...props
}) => {
  return (
    <div css={styles} className="wrapper">
      <div className="header">
        <div css="margin-top:2px;">
          <span>Select your project:</span>
        </div>
        <div css="margin-left:9px;">
          <NiceWhiteButton>
            <div>
              <PlusIcon fill={theme.tertiary} width="14px" css="margin-right: 7px;" />
            </div>
            <div>New Project</div>
          </NiceWhiteButton>
        </div>
      </div>
      <div className="body">
        <input
          className="projectSearchInput"
          id="cavaticaProjectSearch"
          type="text"
          value={projectSearchValue}
          name="cavaticaProjectSearch"
          placeholder="Search projects"
          onChange={e => {
            setProjectSearchValue(e.target.value);
          }}
        />
        <ProjectSelector size="6">
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
          onClick={() => {
            alert('UPLOADED?!');
          }}
        >
          <div>
            <img
              alt=""
              src={cavaticaLogo}
              css={`
                width: 28px;
                margin-right: 7px;
              `}
            />
          </div>
          <div>Copy files to Cavatica project</div>
        </NiceWhiteButton>
      </div>
    </div>
  );
};

export default enhance(CavaticaProjects);
