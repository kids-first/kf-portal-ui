import React from 'react';
import { withTheme } from 'emotion-theming';
import { compose } from 'recompose';
import { VictoryPie } from 'victory-pie';

const enhance = compose(withTheme);

const CompletionWrapper = ({ completed, theme, children, className, innerCircleSize = '80%' }) => {
  return (
    <div className={`${theme.completionWrapper({ innerCircleSize })} ${className}`}>
      <div className={`backdrop`} />
      <VictoryPie
        labels={() => null}
        padding={0}
        data={[
          { y: 100 * completed, fill: theme.highlight },
          { y: 100 - completed * 100, fill: '#cdd0d9' },
        ]}
      />
      <div className={`innerCircle`}>{children}</div>
    </div>
  );
};

export default enhance(CompletionWrapper);
