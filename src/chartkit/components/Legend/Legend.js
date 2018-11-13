import React from 'react';
import SvgSquare from './SvgSquare';
import SvgText from './SvgText';

/**
 * Basic spacing for now, can be improved on
 * based on nivo legend spacing
 * 
    let xStep = 0
    let yStep = 0
    if (direction === DIRECTION_ROW) {
        xStep = itemWidth + itemsSpacing
    } else if (direction === DIRECTION_COLUMN) {
        yStep = itemHeight + itemsSpacing
    } 
 */

const DIRECTION_ROW = 'ROW';

const Legend = ({ legends = [], direction = DIRECTION_ROW, theme }) => {
  const { itemWidth, itemsSpacing, iconSize, icon, text, style } = theme;

  // Max height for our svg based on the largest child elements
  const maxHeight = Math.max(iconSize, text.fontSize) + 1;

  // Center text with our label. Decimals (put simply) don't work with SVG so ceil() it for visually pleasing results
  const textOffsetY = Math.ceil(text.fontSize / 2);

  // Dynamic width on resize for responsiveness
  // const width = `calc(100% - ${style.marginLeft})`;

  return (
    <div style={style}>
      <svg height={maxHeight} xmlns="http://www.w3.org/2000/svg">
        {legends.map((l, i) => {
          let xOffset = 0;

          xOffset = itemWidth + itemsSpacing;

          const legendItem = (
            <g key={i} height={maxHeight} transform={`translate(${i * xOffset}, 0)`} style={style}>
              <SvgSquare
                style={icon}
                fill={l.color}
                height={iconSize}
                width={iconSize}
                x={i * xOffset}
                y={0}
              />
              <SvgText
                style={text}
                textValue={l.title}
                x={i * xOffset + iconSize + 2}
                y={textOffsetY}
              >
                {l.title}
              </SvgText>
            </g>
          );

          return legendItem;
        })}
      </svg>
    </div>
  );
};

export default Legend;
