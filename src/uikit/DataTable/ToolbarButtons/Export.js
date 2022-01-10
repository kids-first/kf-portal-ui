import React, { Component } from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, notification } from 'antd';
import { print } from 'graphql/language/printer';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import urlJoin from 'url-join';

import { arrangerApiRoot, arrangerProjectId } from 'common/injectGlobals';
import {
  participantQueryExport,
  participantsQuery,
} from 'components/CohortBuilder/ParticipantsTableView/queries';
import exportTSV from 'uikit/DataTable/ToolbarButtons/exportTSV';

const formatDataForExport = (result) => (result ? result.nodes.map((node) => ({ ...node })) : []);

export default class Export extends Component {
  static propTypes = {
    downloadName: PropTypes.string,
    selectedRows: PropTypes.arrayOf(PropTypes.string).isRequired,
    columns: PropTypes.array.isRequired,
    api: PropTypes.func.isRequired,
    sqon: PropTypes.object.isRequired,
    dataTotalCount: PropTypes.number.isRequired,
    sort: PropTypes.array,
    exportBtnClassName: PropTypes.string,
  };

  static defaultProps = {
    exportBtnClassName: '',
  };

  state = {
    data: [],
    isLoading: false,
  };

  fetchData = async () => {
    this.setState({ isLoading: true, error: null });
    try {
      const { selectedRows, dataTotalCount, sqon, sort, api, columns, downloadName } = this.props;

      const queries = isEmpty(selectedRows)
        ? [participantsQuery(sqon, sort, dataTotalCount, '')]
        : [participantQueryExport(sqon, selectedRows.length)];

      const rawData = await api({
        method: 'POST',
        url: urlJoin(
          arrangerApiRoot,
          `/${arrangerProjectId}/graphql/GQL_PARTICIPANTS_TABLE_EXPORT`,
        ),
        body: JSON.stringify(
          queries.map((q) => ({
            query: typeof q.query === 'string' ? q.query : print(q.query),
            variables: q.variables,
          })),
        ),
      });

      const data = rawData.map((d, i) => {
        const transform = queries[i].transform;
        return transform ? transform(d) : d;
      });

      exportTSV(formatDataForExport(data[0]), columns, downloadName);
    } catch (error) {
      notification.error({
        message: 'Export Table',
        description: 'An error occurred. The table can not be exported. Please try again.',
        duration: 5,
      });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleClick = async () => {
    await this.fetchData();
  };

  render() {
    const { exportBtnClassName } = this.props;
    return (
      <Button
        className={exportBtnClassName}
        loading={this.state.isLoading}
        onClick={this.handleClick}
        type="link"
      >
        <DownloadOutlined />
        Export
      </Button>
    );
  }
}
