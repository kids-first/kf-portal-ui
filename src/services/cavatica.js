import ajax from 'services/ajax';
import { cavaticaApiRoot } from 'common/injectGlobals';
import { chunk as makeChunks } from 'lodash';

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
  let data;
  try {
    const response = await ajax.post(cavaticaApiRoot, {
      path: '/user',
      method: 'GET',
    });
    data = response.data;
  } catch (error) {
    console.warn(error);
  }
  return data;
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
  let items;
  try {
    const response = await ajax.post(cavaticaApiRoot, {
      path: '/billing/groups',
      method: 'GET',
    });
    items = response.data.items;
  } catch (error) {
    console.warn(error);
  }
  return items;
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
  let items;
  try {
    const response = await ajax.post(cavaticaApiRoot, {
      path: '/projects',
      method: 'GET',
    });
    items = response.data.items;
  } catch (error) {
    console.warn(error);
  }
  return items;
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
export const createProject = async ({ name, billing_group, description = '' }) => {
  let data;
  try {
    const response = await ajax.post(cavaticaApiRoot, {
      path: '/projects',
      method: 'POST',
      body: { name, billing_group, description },
    });
    data = response.data;
  } catch (error) {
    console.warn(error);
  }
  return data;
};

export const getFiles = async () => {
  let data;
  try {
    const response = await ajax.post(cavaticaApiRoot, {
      path: '/files',
      method: 'GET',
    });
    data = response.data;
  } catch (error) {
    console.warn(error);
  }
  return data;
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
export const convertGen3FileIds = async ({ ids }) => {
  let items = [];

  /* ABOUT THE CHUNKS:
   * Cavatica has a limit of how many items it can take at one time,
   *  so we batch a list of ids into chunks of size 75
   *  and then repeat the conversion call for each chunk
   */
  const chunks = makeChunks(ids, 75);
  for (const chunk of chunks) {
    try {
      const response = await ajax.post(cavaticaApiRoot, {
        path: '/action/files/resolve_origin_ids',
        method: 'POST',
        body: {
          type: 'dataset',
          dataset: 'sevenbridges/kids-first',
          items: chunk.map(id => {
            return {
              id,
            };
          }),
          // [
          //   { id: 'ffe81227-2d0f-4cb0-be03-f6fa0f93de71' },
          //   { id: 'ff697878-84cd-4ad4-b7da-b1958e9d3c98' },
          // ],
        },
      });
      items.push(...response.data.items);
    } catch (error) {
      console.warn(error);
    }
  }
  return items;
};

/**
 * Requires Cavatica File IDs as returned from convertGen3FileIds
 *
 * project is the project id, not name (ie. userId/projectName)
 * ids is an array of strings of the ids to copy
 */
export const copyFiles = async ({ project, ids }) => {
  let data = [];

  //Cavatica times out if copying too many files at a time,
  // chunk it into groups of 75 to accomodate.
  const chunks = makeChunks(ids, 75);
  for (const chunk of chunks) {
    try {
      const response = await ajax.post(cavaticaApiRoot, {
        path: '/action/files/copy',
        method: 'POST',
        body: {
          project: project,
          file_ids: chunk,
        },
      });
      data.push(response.data);
    } catch (error) {
      console.warn(error);
    }
  }
  return data;
};

//jonqa01/public-housing
