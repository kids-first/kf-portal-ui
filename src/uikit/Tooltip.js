import 'react-tippy/dist/tippy.css';
import React from 'react';
import { Tooltip } from 'react-tippy';

export default props => <Tooltip {...props} useContext html={props.html} />;
