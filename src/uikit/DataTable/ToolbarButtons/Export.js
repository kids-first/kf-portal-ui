import React, { Component } from 'react';
import { ToolbarItem, ToolbarButton, FileDownloadIcon } from './styles';
import { saveAs } from 'file-saver';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import QueriesResolver from 'components/CohortBuilder/QueriesResolver';
import LoadingSpinner from 'uikit/LoadingSpinner';
import isEmpty from 'lodash/isEmpty';
import {
  participantQueryExport,
  participantsQuery,
} from 'components/CohortBuilder/ParticipantsTableView/queries';

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

export default class Export extends Component {
  constructor(props) {
    super(props);
    this.triggerExport = false;
    this.state = {};
  }

  handleClick = () => {
    this.triggerExport = true;
    this.setState({});
  };

  render() {
    const {
      data,
      columns,
      downloadName,
      selectedRows,
      api,
      sqon,
      sort,
      dataTotalCount,
    } = this.props;

    return (
      <ToolbarItem
        onClick={isEmpty(data) ? this.handleClick : () => exportTSV(data, columns, downloadName)}
      >
        <FileDownloadIcon width="12" height="12px" fill="#008299" style={{ marginRight: '7px' }} />
        <ToolbarButton>EXPORT</ToolbarButton>

        {this.triggerExport && isEmpty(data) && (
          <QueriesResolver
            name="GQL_PARTICIPANTS_TABLE_EXPORT"
            api={api}
            queries={
              isEmpty(selectedRows)
                ? [participantsQuery(sqon, sort, dataTotalCount, '')]
                : [participantQueryExport(sqon, selectedRows.length)]
            }
          >
            {({ isLoading, data, error }) => {
              if (error) {
                console.log('error', error);
              }
              if (isLoading) {
                return <LoadingSpinner />;
              }
              const dataExport = data[0] ? data[0].nodes.map(node => ({ ...node })) : [];
              if (!isEmpty(dataExport)) {
                exportTSV(dataExport, columns, downloadName);
                this.triggerExport = false;
              }
              return '';
            }}
          </QueriesResolver>
        )}
      </ToolbarItem>
    );
  }
}
