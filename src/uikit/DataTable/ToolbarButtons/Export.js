import React from 'react';
import { ToolbarItem, ToolbarButton, FileDownloadIcon } from './styles';
import { saveAs } from 'file-saver';
import { isObject } from 'lodash';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';

const trackExportInteraction = ({ category, action, label }) => {
  trackUserInteraction({
    category: category || TRACKING_EVENTS.categories.entityPage.file,
    action: action || TRACKING_EVENTS.actions.download.report,
    ...(label && { label: isObject(label) ? JSON.stringify(label) : label })
  })
};

const exportTSV = (data, columns, filename, tableViewTracking) => {
  const visibleCols = columns.filter(c => c.show && !c.skipExport);
  const headers = visibleCols.map(h => h.exportHeader || h.Header).join('\t');
  const rows = data.map(d => visibleCols.map(header => d[header.accessor]).join('\t')).join('\n');

  const blob = new Blob([headers + '\n' + rows], { type: 'data:text/tab-separated-values' });
  if (tableViewTracking) {
    trackExportInteraction({
      category: `${tableViewTracking}: Headers: Export`,
      action: TRACKING_EVENTS.actions.click,
      label: filename,
    });
  }
  trackExportInteraction({ label: filename });
  saveAs(blob, `${filename}.tsv`);
};

const Export = ({ exporter = x => x, data, columns, downloadName, tableViewTracking, ...props }) => (
  <ToolbarItem onClick={() => exportTSV(data, columns, downloadName, tableViewTracking)} {...props}>
    <FileDownloadIcon width="12" height="12px" fill="#008299" style={{ marginRight: '7px' }} />
    <ToolbarButton>EXPORT</ToolbarButton>
  </ToolbarItem>
);

export default Export;
