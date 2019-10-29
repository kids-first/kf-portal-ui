import { convertFenceUuids, copyFiles as copyCavaticaFiles } from 'services/cavatica';
import { FENCES } from 'common/constants';

export const copyToProject = async ({ selectedFiles, selectedProject }) => {
  const promises = Object.keys(selectedFiles)
    .filter(
      fence => FENCES.includes(fence) && selectedFiles[fence] && selectedFiles[fence].length > 0,
    )
    .map(async fence => {
      try {
        const convertedFence = await convertFenceUuids({
          ids: selectedFiles[fence],
          fence: fence,
        });

        await copyCavaticaFiles({
          project: selectedProject,
          ids: [...convertedFence.map(item => item.id)],
        });
      } catch (error) {
        throw error;
      }
    });
  return await Promise.all(promises);
};
