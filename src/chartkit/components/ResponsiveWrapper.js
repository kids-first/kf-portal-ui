import React from 'react';
import { withContentRect } from 'react-measure';

const ResponsiveWrapper = withContentRect('bounds')(
  ({ measureRef, measure, contentRect = { bounds: { width: -1, height: -1 } }, children }) => {
    const { width, height } = contentRect.bounds;
    const shouldRender = width > 0 && height > 0;

    return (
      <div ref={measureRef} style={{ width: '100%', height: '100%' }}>
        {shouldRender && children({ width })}
      </div>
    );
  },
);

export default ResponsiveWrapper;
