import React from 'react';
import downloadIcon from '../../assets/icon-download-white.svg';
import Spinner from './Spinner';

const DownloadIcon = ({ className, loading }) =>
  loading ? (
    <Spinner size={15} />
  ) : (
    <img
      alt=""
      src={downloadIcon}
      css={`
        width: 10px;
        margin-right: 9px;
        ${className};
      `}
    />
  );

export default DownloadIcon;
