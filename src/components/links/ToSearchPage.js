import React from 'react';
import { Link } from 'react-router-dom';

export default ({ index, ...props }) => <Link to={`/search/${index}`} {...props} />;
