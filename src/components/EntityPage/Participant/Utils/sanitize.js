/**
 * Sanitizes an object to display it in HTML.
 *
 * @param obj Either an Object of an Array of Objects.
 * @returns {*}
 */
function sanitize(obj) {

  if(Array.isArray(obj)) return obj.map(sanitize);

  for(let key in obj) {
    let sanitized = obj[key];
    if (sanitized === null) sanitized = "--";
    else if(typeof sanitized === "boolean") sanitized = `${sanitized}`;

    obj[key] = sanitized;
  }

  return obj;
}

export default sanitize;