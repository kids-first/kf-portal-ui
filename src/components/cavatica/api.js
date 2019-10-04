import { convertFenceUuids, copyFiles as copyCavaticaFiles } from 'services/cavatica';
import { FENCES } from 'common/constants';

export const copyToProject = async ({ selectedFiles, selectedProject }) => {
  const promises = [];

  // Make a request to get cavaticaIds forEach repository, stick it in our promises list
  //  Don't do the async await in the forEach loop...
  Object.keys(selectedFiles).forEach(fence => {
    if (FENCES.includes(fence) && selectedFiles[fence] && selectedFiles[fence].length > 0) {
      // Convert KF_IDs to CavaticaIds
      const promise = convertFenceUuids({
        ids: selectedFiles[fence],
        fence: fence,
      }).then(response =>
        // Then Copy to Cavatica
        copyCavaticaFiles({
          project: selectedProject,
          ids: [...response.map(item => item.id)],
        }),
      );
      promises.push(promise);
    }
  });

  return await Promise.all(promises);
};
