import React from 'react';
import { ToolbarItem, ToolbarButton, FileDownloadIcon } from './styles';
import { saveAs } from 'file-saver';

const exportTSV = (data, columns, filename) => {
  const visbleCols = columns.filter(c => c.show);
  const headers = visbleCols.map(h => h.Header).join('\t');
  const rows = data.map(d => visbleCols.map(header => d[header.accessor]).join('\t')).join('\n');

  const blob = new Blob([headers + '\n' + rows], { type: 'data:text/tab-separated-values' });
  saveAs(blob, `${filename}.tsv`);
};

const Export = ({ exporter = x => x, data, columns, downloadName, ...props }) => (
  <ToolbarItem onClick={() => exportTSV(data, columns, downloadName)} {...props}>
    <FileDownloadIcon width="12" height="12px" fill="#008299" style={{ marginRight: '7px' }} />
    <ToolbarButton>EXPORT</ToolbarButton>
  </ToolbarItem>
);

export default Export;
