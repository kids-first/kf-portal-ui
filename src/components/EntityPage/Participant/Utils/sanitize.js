/**
 * Sanitizes an object to display it in HTML.
 *
 * This does not mutate the original object.
 *
 * @param obj Either an Object of an Array of Objects.
 * @returns {*}
 */
export default function sanitize(obj) {
  if (Array.isArray(obj)) return obj.map(sanitize);

  return Object.keys(obj).reduce((cleanObj, key) => {
    cleanObj[key] = prettify(obj[key]);

    return cleanObj;
  }, {});
}

function prettify(val) {
  if (val === null) return '--';
  else if (typeof val === 'boolean') return `${val}`;
  else if (!isNaN(val) && val == parseInt('' + val, 10)) return prettifyNumber('' + val, '');
  else return val;
}

function prettifyNumber(num, acc) {
  if (num.length <= 3) return '' + num + acc;
  else return prettifyNumber(num.slice(0, num.length - 3), `,${num.slice(-3)}${acc}`);
}
