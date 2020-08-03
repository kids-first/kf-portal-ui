import ajax from 'services/ajax';
import { cavaticaApiRoot, cavaticaWebRoot } from 'common/injectGlobals';
import makeChunks from 'lodash/chunk';
import projectDescriptionPath from './projectDescription.md';
import memoize from 'lodash/memoize';

// All these services call out to a proxy service
//  The body of the request contains all details for the request that should be sent to the cavatica API
//  Documentation on the cavatica API: http://docs.cavatica.org/docs/the-api

/** getUser()
  Return object structure:
    {
      "href": "https://cavatica-api.sbgenomics.com/v2/users/jondev01",
      "username": "jondev01",
      "email": "jondev01@yopmail.com",
      "first_name": "Jon",
      "last_name": "Dev",
      "tags": [],
      "affiliation": "Developer",
      "phone": "",
      "address": "",
      "city": "",
      "state": "",
      "country": "United States",
      "zip_code": ""
    }
  */
export const getUser = async () => {
  const response = await ajax.post(cavaticaApiRoot, {
    path: '/user',
    method: 'GET',
  });
  return response.data;
};

/**
Should return array of billing groups with the form:
  {
      "id": "864ca119-0298-4e0b-83e2-36861d3a5ace",
      "href": "https://cavatica-api.sbgenomics.com/v2/billing/groups/864ca119-0298-4e0b-83e2-36861d3a5ace",
      "name": "Pilot Funds"
  }
*/
export const getBillingGroups = async () => {
  const response = await ajax.post(cavaticaApiRoot, {
    path: '/billing/groups',
    method: 'GET',
  });
  return response.data.items;
};

/**
 * Return array of projects, each of the form:
    {
        "href": "https://cavatica-api.sbgenomics.com/v2/projects/username01/test-project",
        "id": "username01/test-project",
        "name": "test project"
    }
 */
export const getProjects = async () => {
  const response = await ajax.post(cavaticaApiRoot, {
    path: '/projects',
    method: 'GET',
  });
  return response.data.items;
};

/**
 * Returns details of created project, or error:
  {
    "href": "https://cavatica-api.sbgenomics.com/v2/projects/username01/test-project",
    "id": "username01/test-project",
    "name": "test project",
    "type": "v2",
    "description": "test description",
    "tags": [],
    "settings": {
        "locked": false,
        "controlled": false,
        "use_interruptible_instances": false
    },
    "billing_group": "864ca119-0298-4e0b-83e2-36861d3a5ace"
  }
 *
 */
const createProject = async ({ name, billing_group, description = '' }) => {
  const response = await ajax.post(cavaticaApiRoot, {
    path: '/projects',
    method: 'POST',
    body: { name, billing_group, description },
  });
  return response.data;
};

export const getMembers = async ({ project }) => {
  let data;
  try {
    const response = await ajax.post(cavaticaApiRoot, {
      path: `/projects/${project}/members`,
      method: 'GET',
    });
    data = response.data;
  } catch (error) {
    console.warn(error);
  }
  return data;
};

export const getTasks = async ({ type, project }) => {
  let data;
  try {
    const response = await ajax.post(cavaticaApiRoot, {
      path: `/tasks?project=${project}&status=${type}`,
      method: 'GET',
    });
    data = response.data;
  } catch (error) {
    console.warn(error);
  }
  return data;
};

export const getTaskLink = ({ project, status }) =>
  `${cavaticaWebRoot}u/${project}/tasks/#q?page=1&status=${status}`;

/**
 * ids - array of Gen3 Ids as strings
 * returns an array of objects representing the Cavatica file equivalents
 *  these objects have the form:
 *    {
 *      "href": "https://api-kids-first-vayu.sbgenomics.com/v2/files/5a98298e20947e0f33468143",
 *      "id": "5a98298e20947e0f33468143",
 *      "name": "HG00235.mapped.SOLID.bfast.GBR.exome.20110411.bam.bas"
 *    }
 */
export const convertFenceUuids = async ({ ids }) => {
  const items = [];
  /* ABOUT THE CHUNKS:
   * Cavatica has a limit of how many items it can take at one time,
   *  so we batch a list of ids into chunks of size 75
   *  and then repeat the conversion call for each chunk
   */
  const chunks = makeChunks(ids, 75);
  for (const chunk of chunks) {
    const response = await ajax.post(cavaticaApiRoot, {
      path: '/action/files/resolve_origin_ids',
      method: 'POST',
      body: {
        type: 'dataset',
        // The dataset to use if fence dependent, we keep a listing of them in common/constants
        dataset: 'sevenbridges/kids-first',
        items: chunk.map((id) => ({
          id,
        })),
        // [
        //   { id: 'ffe81227-2d0f-4cb0-be03-f6fa0f93de71' },
        //   { id: 'ff697878-84cd-4ad4-b7da-b1958e9d3c98' },
        // ],
      },
    });
    items.push(...response.data.items);
  }
  return items;
};

/**
 * Requires Cavatica File IDs as returned from convertFenceUuids
 *
 * project is the project id, not name (ie. userId/projectName)
 * ids is an array of strings of the ids to copy
 */
export const copyFiles = async ({ project, ids }) => {
  const data = [];
  //Cavatica times out if copying too many files at a time,
  // chunk it into groups of 75 to accomodate.
  const chunks = makeChunks(ids, 75);
  for (const chunk of chunks) {
    const response = await ajax.post(cavaticaApiRoot, {
      path: '/action/files/copy',
      method: 'POST',
      body: {
        project: project,
        file_ids: chunk,
      },
    });
    data.push(response.data);
  }
  return data;
};

/**
 * Fetches the content of the markdown template. Memoizes the result
 */
const getProjectDescriptionTemplate = memoize(() =>
  fetch(projectDescriptionPath).then((res) => res.text()),
);

/**
 * A wrapper for the above createProject method. Every project
 * created from kidsfirst comes with a description in markdown
 * @param {projectName: string, billingGroupId: string} param0
 */
export const saveProject = async ({ projectName, billingGroupId }) => {
  const USER_NAME_TEMPLATE_STRING = '<username>';
  const PROJECT_NAME_TEMPLATE_STRING = '<project-name>';
  const [descriptionTemplate, { username }] = await Promise.all([
    getProjectDescriptionTemplate(),
    getUser(),
  ]);
  const projectDescription = descriptionTemplate
    .split(PROJECT_NAME_TEMPLATE_STRING)
    .join(projectName)
    .split(USER_NAME_TEMPLATE_STRING)
    .join(username);
  return createProject({
    billing_group: billingGroupId,
    name: projectName,
    description: projectDescription,
  });
};

export const isValidKey = (key) => key && key.length > 0;
