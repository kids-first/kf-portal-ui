/**
 * Extract text from `FileList` objects.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/FileList
 *
 * @param {FileList} fileList - a `FileList` object.
 * @param {Function} callback - an optional callback `(err: Error, files: String[]) => {}`.
 *
 * @returns - A promise to an array of the content of the files.
 */
export const parseInputFiles = (fileList, callback) => {
  return Promise.all(
    // FileList is an array-like object, so convert it to an Array of File first.
    Array.from(fileList).map(parseInputFile),
  ).then(files => {
    callback && callback(null, files);
    return files;
  });
};

/**
 * Extract text from a single `File` object.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/File
 *
 * @param {File} file - a `File` object.
 *
 * @returns {Promise<string>} the text content of the file
 */
export const parseInputFile = file => {
  return new Promise((resolve, reject) => {
    // extract file encoding from MIME type, default to utf-8
    const results = /[^;]*;charset=(.*)/.test(file.type || '');
    const encoding = (results && results[1]) || 'utf-8';

    const reader = new FileReader();
    reader.onload = () => {
      reader.onabort = null;
      reader.onerror = null;
      reader.onload = null;
      resolve(reader.result);
    };
    reader.onerror = e => reject(e);
    reader.onabort = () => reject(`FileReader was aborted for file "${file && file.name}"`);
    // load the file
    reader.readAsText(file, encoding);
  });
};
