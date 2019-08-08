/**
 * Extract text from `FileList` objects.
 * @param {FileList} fileList - and `FileList` object.
 *
 * @returns {String[]} - An array of the content of the files.
 */
export const parseInputFiles = fileList => {
  return Promise.all(
    // FileList is an array-like object, so convert it to an Array of File first.
    Array.from(fileList).map(parseInputFile),
  );
};

export const parseInputFile = file => {
  return new Promise((resolve, reject) => {
    // TODO JB : remove listeners when done
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = e => reject(e);
    reader.readAsText(file);
  });
};
