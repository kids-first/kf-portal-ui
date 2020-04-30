import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import { saveAs } from 'file-saver';

const exportTSV = (data, columns, filename) => {
  const visibleCols = columns.filter(c => c.show && !c.skipExport);
  const headers = visibleCols.map(h => h.exportHeader || h.Header).join('\t');
  const rows = data.map(d => visibleCols.map(header => d[header.accessor]).join('\t')).join('\n');

  const blob = new Blob([headers + '\n' + rows], { type: 'data:text/tab-separated-values' });
  trackUserInteraction({
    category: TRACKING_EVENTS.categories.entityPage.file,
    action: TRACKING_EVENTS.actions.download.report,
    label: filename,
  });
  saveAs(blob, `${filename}.tsv`);
};

export default exportTSV;