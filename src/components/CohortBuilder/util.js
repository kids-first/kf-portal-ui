const SEARCH_FILE_RELATIVE_URL = '/search/file';
export const createFileRepoLink = sqon =>
  `${SEARCH_FILE_RELATIVE_URL}?sqon=` + encodeURI(JSON.stringify(sqon));
