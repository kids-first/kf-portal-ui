import { Link } from 'uikit/Core';
import * as React from 'react';

export default ({ value }) => <Link to={`/participant/${value}#summary`}>{value}</Link>;
