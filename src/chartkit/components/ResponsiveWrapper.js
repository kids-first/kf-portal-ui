import React from 'react';
import { withContentRect } from 'react-measure';

const ResponsiveWrapper = withContentRect('bound')(
  ({ measureRef, measure, contentRect = { width: -1, height: -1 } }) => {
    const { width, height } = contentRect.bounds;
    const shouldRender = width > 0 && height > 0;
    console.log('content rect bounds', contentRect.bounds);

    return (
      <div ref={measureRef} style={{ width: '100%', height: '100%' }}>
        {shouldRender && this.props.children({ width, height })}
      </div>
    );
  },
);

export default ResponsiveWrapper;
