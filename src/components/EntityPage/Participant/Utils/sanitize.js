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
  else if (isFinite(Number(val))) return prettifyNumber(val);
  else if (val === "") return "--";
  else return val;
}

function prettifyNumber(num) {
  num = ""+num;

  function iter(fragment, acc) {
    if (fragment.length <= 3) return '' + fragment + acc;
    else return iter(fragment.slice(0, fragment.length - 3), `,${fragment.slice(-3)}${acc}`);
  }

  if(num.includes(".")) { //handles decimals
    const intAndDecimal = num.split(".");

    return iter(intAndDecimal[0], "."+intAndDecimal[1]);
  } else {                            //handles integers
    return iter(num, "")
  }
}
