import React, { ReactNode } from 'react';

import './GridContainer.css';

interface Props {
  children: ReactNode;
}

const GridContainer = ({ children }: Props) => <div className={'grid-container'}>{children}</div>;

export default GridContainer;
