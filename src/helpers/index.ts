//ref https://blog.logrocket.com/how-to-create-compose-function-typescript
export const compose = <T>(fn1: (a: T) => T, ...fns: Array<(a: T) => T>) =>
  fns.reduce((prevFn, nextFn) => (value) => prevFn(nextFn(value)), fn1);
export const isBoolTrue = (value: number | boolean | string | undefined | null) =>
  'true' === value?.toString().toLowerCase();

export const isBoolFalse = (value: number | boolean | string | undefined | null) =>
  'false' === value?.toString().toLowerCase();

export const makeUniqueWords = (words: string[] | number[] | boolean[]): string[] => {
  //widen type to please Typescript with .filter
  const normalizedWords = words as (string | number | boolean)[];

  const sWords = normalizedWords.filter((w) => w != null).map((w) => String(w));

  return [...new Set(sWords)];
};

export const makeUniqueCleanWords = compose((l: string[]) => l.filter((x) => !!x), makeUniqueWords);

export const joinUniqueCleanWords = (l: string[], del: string = ', '): string =>
  makeUniqueCleanWords(l ?? []).join(del);
