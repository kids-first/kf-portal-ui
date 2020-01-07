import React from 'react';
import PropTypes from 'prop-types';

/**
 * Formats a text value. Returns the same text value
 * with a portion of the text in bold.
 * @param {String}    value           Text to be formatted (ex. "xx abc yy")
 * @param {[String]}  highLightValues Array of highlighted texts
 * (ex. ["...", "xx <em>abc</em> yy", ".."]
 * @param classname
 * @param index
 * @return {Object} (ex. <div>xx <b>abc</b> yy</div>
 */


const regex = /<.+?>(.+?)<\/.+?>/g;
const regexTag = /<\/?em>/gi;

const FormatLabel = ({ value, highLightValues, classname = '', index }) => {
  if (!highLightValues) {
    return (
      <div key={index} className={`format-label ${classname}`} style={{ maxWidth: 350 }}>
        {value}
      </div>
    );
  }

  const isHighlight = hit => {
    return value === hit.replace(regexTag, '');
  };

  // eslint-disable-next-line no-unused-vars
  const [head, ...tail] = highLightValues.filter(isHighlight);

  if (head) {

    const arr2 = head.split(regex);

    return (
      <div
        key={index}
        className={`format-label ${classname}`}
        style={{ maxWidth: 350, display: 'flex', whiteSpace: 'pre-wrap' }}
      >
        <span>
          {arr2.map((text, index) => {
            return index % 2 ? <b>{text}</b> : text;
          })}
        </span>
      </div>
    );
  } else {
    return (
      <div key={index} className={`format-label ${classname}`} style={{ maxWidth: 350 }}>
        {value}
      </div>
    );
  }
};

FormatLabel.propTypes = {
  value: PropTypes.string,
  highLightValues: PropTypes.array,
  classname: PropTypes.string,
  index: PropTypes.number.isRequired,
};

export default FormatLabel;
