import React from 'react';
import TrashIcon from 'react-icons/lib/fa/trash';

export default ({ className, ...props }) => (
  <TrashIcon className={`trashIcon ${className} `} {...props} />
);
