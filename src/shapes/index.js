export { default as effectsShape } from './effects';
export { default as loggedInUserShape } from './loggedInUser';
export { default as historyShape } from './history';
export { default as sqonShape } from './sqon';
export { default as extendedMappingShape } from './extendedMapping';

// const test = extendedMapping.reduce((props, mapping) => {
//   Object.entries(mapping).forEach(([key, value]) => {
//     if (!props[key]) {
//       props[key] = [];
//     }
//     let type = typeof value;
//     if (value === null) type = 'null';
//     if (Array.isArray(value)) type = 'array';
//     if (!props[key].includes(type)) {
//       props[key].push(type);
//     }
//   });
//   return props;
// }, {});
