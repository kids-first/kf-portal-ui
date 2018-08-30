export const toGqlString = str => str.replace('.', '__');
export const fromGqlString = str => str.replace('__', '.');
export const hocToRenderProps = hoc => hoc(({ render, ...props }) => render(props));
