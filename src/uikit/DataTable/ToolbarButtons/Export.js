import React from 'react';
import { ToolbarItem, ToolbarButton, FileDownloadIcon } from './styles';
import { saveAs } from 'file-saver';

const exportTSV = (data, columns, filename) => {
  const headers = columns.map(h => h.Header).join('\t');
  const rows = data.map(d => columns.map(header => d[header.accessor]).join('\t')).join('\n');

  const blob = new Blob([headers + '\n' + rows], { type: 'data:text/tab-separated-values' });
  saveAs(blob, 'test.tsv');
};

const Export = ({ exporter = x => x, data, columns, ...props }) => (
  <ToolbarItem {...props}>
    <FileDownloadIcon width="12" height="12px" fill="#008299" style={{ marginRight: '7px' }} />
    <ToolbarButton onClick={x => exportTSV(data, columns)}>EXPORT</ToolbarButton>
  </ToolbarItem>
);

export default Export;
