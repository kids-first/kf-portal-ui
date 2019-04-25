// import React from 'react';
import React, { Component } from 'react';
import { ToolbarItem, ToolbarButton, FileDownloadIcon } from './styles';
import { saveAs } from 'file-saver';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import QueriesResolver from 'components/CohortBuilder/QueriesResolver';
import {
  participantQueryExport,
  participantsQuery,
} from 'components/CohortBuilder/ParticipantsTableView/queries';
import { isEmpty } from 'lodash';

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

// const Export = ({
//   exporter = x => x,
//   // data,
//   columns,
//   downloadName,
//   // selectedRows,
//   api,
//   sqon,
//   ...props
// }) => {

//   return (
//     // <ToolbarItem onClick={() => exportTSV(data, columns, downloadName)} {...props}>
//     <ToolbarItem
//       onClick={() => {
//         // return (triggerExport = true);
//       }}
//       style={{ border: '1px solid red' }}
//     >
//       <FileDownloadIcon width="12" height="12px" fill="#008299" style={{ marginRight: '7px' }} />
//       <ToolbarButton>EXPORT</ToolbarButton>
//       {console.log('*****triggerExport___1', triggerExport)};
//       {triggerExport && (
//         <QueriesResolver
//           name="GQL_PARTICIPANTS_TABLE_EXPORT_REFACT"
//           api={api}
//           queries={[participantQueryExport(sqon)]}
//         >
//           {({ isLoading, data, error }) => {
//             console.log('*****triggerExport___2', triggerExport);
//             console.log('******columns****', columns);
//             // console.log('*******downloadName****', downloadName);
//             console.log('****data***', data);
//             triggerExport = false;
//             exportTSV(data, columns, downloadName);
//             return '';
//           }}
//         </QueriesResolver>
//       )}
//     </ToolbarItem>
//   );

//   // );
// };

// export default Export;

export default class Export extends Component {
  constructor(props) {
    super(props);
    this.state = {
      triggerExport: false,
    };
  }

  render() {
    const {
      // data,
      columns,
      downloadName,
      selectedRows,
      api,
      sqon,
      sort,
      dataTotalCount,
    } = this.props;
    return (
      // <ToolbarItem onClick={() => exportTSV(data, columns, downloadName)} {...props}>

      <ToolbarItem
        onClick={() => {
          this.setState({ triggerExport: !this.state.triggerExport });
        }}
      >
        <FileDownloadIcon width="12" height="12px" fill="#008299" style={{ marginRight: '7px' }} />
        <ToolbarButton>EXPORT</ToolbarButton>
        {this.state.triggerExport && (
          <QueriesResolver
            name="GQL_PARTICIPANTS_TABLE_EXPORT_REFACT"
            api={api}
            queries={
              isEmpty(selectedRows)
                ? [participantsQuery(sqon, sort, dataTotalCount, '')]
                : [participantQueryExport(sqon)]
            }
          >
            {({ isLoading, data, error }) => {
              if (error) {
                console.log('error', error);
              }
              const dataExport = data[0] ? data[0].nodes.map(node => ({ ...node })) : [];
              if (!isEmpty(dataExport)) {
                exportTSV(dataExport, columns, downloadName);
                this.setState({ triggerExport: false });
              }
              return '';
            }}
          </QueriesResolver>
        )}
      </ToolbarItem>
    );
  }
}
