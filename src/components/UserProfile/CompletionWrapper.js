import React from 'react';
import { withTheme } from 'emotion-theming';
import { compose } from 'recompose';
import { VictoryPie } from 'victory-pie';

const enhance = compose(withTheme);

const CompletionWrapper = ({ completed, theme, children, className, innerCircleSize = '80%' }) => {
  return (
    <div
      css={`
        width: 208px;
        padding: 0.73%;
        border-radius: 50%;
        position: relative;
        overflow: hidden;
        svg {
          display: block;
        }
        ${className};
      `}
    >
      <div
        css={`
          background-color: #fff;
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          opacity: 0.5;
        `}
      />
      <VictoryPie
        labels={() => null}
        padding={0}
        data={[
          { y: 100 * completed, fill: theme.highlight },
          { y: 100 - completed * 100, fill: '#cdd0d9' },
        ]}
      />
      <div
        css={`
          border-radius: 50%;
          overflow: hidden;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: ${innerCircleSize};
          height: ${innerCircleSize};
        `}
      >
        {children}
      </div>
    </div>
  );
};

export default enhance(CompletionWrapper);
