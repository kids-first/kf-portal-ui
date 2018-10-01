export const toGqlString = str => str.replace('.', '__');
export const fromGqlString = str => str.replace('__', '.');
export const hocToRenderProps = hoc => hoc(({ render, ...props }) => render(props));
export const memoize = asyncOp => {
  const hash = JSON.stringify;
  const cache = {};
  return async (...input) => {
    const hasKey = hash(input);
    if (!cache[hasKey]) {
      cache[hasKey] = await asyncOp(...input);
    }
    return cache[hasKey];
  };
};
