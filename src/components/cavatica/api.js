import { convertFenceUuids, copyFiles as copyCavaticaFiles } from 'services/cavatica';
import { AllFencesNames } from 'store/fenceTypes';

export const isEveryFileTransferred = (inputLength, outputLength) => inputLength === outputLength;

export const sumFilesTransfers = (copyResults = []) =>
  copyResults.reduce(
    (acc, copyResult) => {
      const numOfIdsToBeCopied = copyResult.numOfIdsToBeCopied;
      const numOfIdsCopied = copyResult.numOfIdsCopied;

      if (isEveryFileTransferred(numOfIdsToBeCopied, numOfIdsCopied)) {
        return acc;
      }
      return {
        numOfIdsCopied: acc.numOfIdsCopied + numOfIdsCopied,
        numOfIdsToBeCopied: acc.numOfIdsToBeCopied + numOfIdsToBeCopied,
      };
    },
    {
      numOfIdsCopied: 0,
      numOfIdsToBeCopied: 0,
    },
  );

export const copyToProject = async ({ selectedFiles, selectedProject }) => {
  const promises = Object.keys(selectedFiles)
    .filter(
      (fence) =>
        AllFencesNames.includes(fence) && selectedFiles[fence] && selectedFiles[fence].length > 0,
    )
    .map(async (fence) => {
      const convertedFence = await convertFenceUuids({
        ids: selectedFiles[fence],
        fence: fence,
      });

      const copiedResults = await copyCavaticaFiles({
        project: selectedProject,
        ids: [...convertedFence.map((item) => item.id)],
      });

      //give the caller some insight of how copying went
      return {
        numOfIdsToBeCopied: selectedFiles[fence].length,
        numOfIdsCopied: copiedResults.map(Object.keys).flat().length,
      };
    });
  return await Promise.all(promises);
};
