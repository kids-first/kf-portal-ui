/**
 * Sanitizes an object to display it in HTML.
 *
 * This does not mutate the original object.
 *
 * @param obj Either an Object of an Array of Objects.
 * @returns {*}
 */
function sanitize(obj) {

  if(Array.isArray(obj)) return obj.map(sanitize);

  return Object.keys(obj).reduce( (cleanObj, key) => {
    const val = obj[key];

    cleanObj[key] =
      val === null ?  //if null, --
        "--" :
        typeof val === "boolean" ?  //otherwise, if boolean, "boolean"
          `${val}` :
          val;        //else just the val.

    return cleanObj;
  }, {});
}

export default sanitize;