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

const FormatLabel = ({ value, highLightValues, classname = '', index, prepend, fullWidth }) => {
  const _width = fullWidth ? null : 350;

  if (!highLightValues) {
    return (
      <div key={index} className={`format-label ${classname}`} style={{ maxWidth: _width }}>
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
        style={{ maxWidth: _width, display: 'flex', whiteSpace: 'pre-wrap' }}
      >
        <span>
          {prepend ? <span className={'local-title'}>{prepend} </span> : ''}
          {arr2.map((text, index) => {
            return index % 2 ? <b key={index}>{text}</b> : text;
          })}
        </span>
      </div>
    );
  }
  return (
    <div key={index} className={`format-label ${classname}`} style={{ maxWidth: _width }}>
      {value}
    </div>
  );
};

FormatLabel.propTypes = {
  value: PropTypes.string,
  prepend: PropTypes.string,
  fullWidth: PropTypes.bool,
  highLightValues: PropTypes.array,
  classname: PropTypes.string,
  index: PropTypes.number.isRequired,
};

export default FormatLabel;
