import * as React from 'react';

import { ACTIONS_COLUMNS, FILE_VIEW } from 'common/constants';
import CavaticaCopyMultipleFilesModal from './CavaticaCopyMultipleFilesModal';
import CavaticaCopyAccessFileModal from './CavaticaCopyOpenAccessFileModal';

const isModalInitiatedByOneOpenAccessFile = (source = {}, fileIds = []) => {
  return (
    [ACTIONS_COLUMNS, FILE_VIEW].includes(source.location) &&
    Boolean(source.hasAccess) &&
    fileIds.length === 1
  );
};

const CavaticaCopyModalManager = ({ fileIds, filesSelected, source, onComplete, ...props }) => {
  if (isModalInitiatedByOneOpenAccessFile(source, fileIds)) {
    return <CavaticaCopyAccessFileModal fileId={fileIds[0]} onComplete={onComplete} />;
  }
  return (
    <CavaticaCopyMultipleFilesModal
      {...{
        fileIds,
        filesSelected,
        source,
        onComplete,
        ...props,
      }}
    />
  );
};

export default CavaticaCopyModalManager;
