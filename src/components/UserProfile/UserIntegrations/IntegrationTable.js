import React from 'react';

import './UserIntegration.css';

export default ({ children, ...props }) => {
  return (
    <div className="userIntegrationsWrapper" {...props}>
      <table>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};
