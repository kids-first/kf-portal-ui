export default (data, transforms) =>
  data.map(datum =>
    Object.keys(transforms)
      .map(key => ({
        field: key,
        value: transforms[key](datum[key]),
      }))
      .reduce(
        (prev, curr) => {
          prev[curr.field] = curr.value;
          return prev;
        },
        { ...datum },
      ),
  );
