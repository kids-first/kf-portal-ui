import React from 'react';

import './UserIntegration.css';

export default ({ children, ...props }) => {
  return (
    <div className="userIntegrationsWrapper" {...props}>
      <table style={{ width: '100%' }}>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};
