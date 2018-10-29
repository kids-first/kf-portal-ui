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

const Legend = ({ legends = [], direction = DIRECTION_ROW, style, theme }) => {
  const { itemHeight, itemWidth, itemsSpacing, iconSize, icon, text } = theme;

  return (
    <div style={style}>
      <svg height={itemHeight} xmlns="http://www.w3.org/2000/svg">
        {legends.map((l, i) => {
          let xOffset = 0;

          xOffset = itemWidth + itemsSpacing;

          const legendItem = (
            <g key={i} height={iconSize} transform={`translate(${i * xOffset}, 0)`}>
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
                y={iconSize / 2}
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
