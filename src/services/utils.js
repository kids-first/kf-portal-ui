export const toGqlString = str => str.replace('.', '__');
export const fromGqlString = str => str.replace('__', '.');
