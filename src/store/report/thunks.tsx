import intl from 'react-intl-universal';
import { ProColumnType, TColumnStates } from '@ferlab/ui/core/components/ProTable/types';
import { SortDirection } from '@ferlab/ui/core/graphql/constants';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import { INDEXES } from 'graphql/constants';
import { capitalize, startCase } from 'lodash';

import { getDefaultContentType } from 'common/downloader';
import { trackReportDownload } from 'services/analytics';
import { ArrangerApi } from 'services/api/arranger';
import { ReportApi } from 'services/api/reports';
import { IDownloadTranslation, ReportConfig } from 'services/api/reports/models';
import { globalActions } from 'store/global';

import { TFetchTSVArgs } from './types';

export const SUPPORT_EMAIL = 'support@kidsfirstdrc.org';

const showErrorReportNotif = (thunkApi: any, errorMessage?: string) =>
  thunkApi.dispatch(
    globalActions.displayNotification({
      type: 'error',
      message: intl.get('api.report.error.title'),
      description: errorMessage ? (
        errorMessage
      ) : (
        <div>
          {intl.get('api.report.error.message')}
          <a
            style={{ color: 'unset', textDecoration: 'underline' }}
            href={`mailto:${SUPPORT_EMAIL}`}
          >
            {intl.get('api.report.error.support')}
          </a>
        </div>
      ),
      duration: 5,
    }),
  );

const fetchReport = createAsyncThunk<
  void,
  {
    data: ReportConfig;
    translation?: IDownloadTranslation;
    callback?: () => void;
    errorCallback?: () => void;
  },
  { rejectValue: string }
>('report/generateReport', async (args, thunkAPI) => {
  const messageKey = 'report_pending';

  try {
    thunkAPI.dispatch(
      globalActions.displayMessage({
        type: 'loading',
        key: messageKey,
        content: 'Please wait while we generate your report',
        duration: 0,
      }),
    );
    await ReportApi.generateReport(args.data).then(() => {
      thunkAPI.dispatch(globalActions.destroyMessages([messageKey]));
      thunkAPI.dispatch(
        globalActions.displayNotification({
          type: 'success',
          message: intl.get('api.report.onSuccess.title'),
          description:
            args.translation?.successMessage || intl.get('api.report.onSuccess.fetchReport'),
        }),
      );
    });

    if (args.callback) await args.callback();
  } catch (e) {
    thunkAPI.dispatch(globalActions.destroyMessages([messageKey]));
    showErrorReportNotif(thunkAPI, args.translation?.errorMessage);
    if (args.errorCallback) args.errorCallback();
  }
});

const fetchTsvReport = createAsyncThunk<void, TFetchTSVArgs, { rejectValue: string }>(
  'report/generate/tsv',
  async (args, thunkAPI) => {
    const messageKey = 'report_pending';

    trackReportDownload(`${capitalize(args.index)}-Export-Tsv`);

    thunkAPI.dispatch(
      globalActions.displayMessage({
        type: 'loading',
        key: messageKey,
        content: intl.get('api.report.loading.message'),
        duration: 0,
      }),
    );

    try {
      const formattedDate = format(new Date(), 'yyyy-MM-dd');
      const formattedFileName = `kidsfirst-${args.index}-table-${formattedDate}.tsv`;

      const sortIdField = idField(args.index);

      const { data, response } = await ArrangerApi.generateTsv({
        index: args.index,
        fileName: formattedFileName,
        sqon: args.sqon,
        sort: sortIdField ? [{ field: sortIdField, order: SortDirection.Asc }] : [],
        columns: buildVisibleColumns(args.columns, args.columnStates),
      });

      thunkAPI.dispatch(globalActions.destroyMessages([messageKey]));

      const isSuccess = !!response && response.status >= 200 && response.status < 300;
      if (!isSuccess) {
        showErrorReportNotif(thunkAPI);
        return thunkAPI.rejectWithValue('error');
      }

      thunkAPI.dispatch(
        globalActions.displayNotification({
          type: 'success',
          message: intl.get('api.report.onSuccess.title'),
          description: intl.get('api.report.onSuccess.fetchReport'),
        }),
      );

      saveAs(
        new Blob([data!], {
          type: getDefaultContentType('text'),
        }),
        formattedFileName,
      );
    } catch {
      thunkAPI.dispatch(globalActions.destroyMessages([messageKey]));
      showErrorReportNotif(thunkAPI);
    }
  },
);

const generateLocalTsvReport = createAsyncThunk<
  void,
  {
    index: string;
    fileName?: string;
    headers: ProColumnType[];
    cols: { key: string; visible: boolean }[];
    rows: any[];
  },
  { rejectValue: string }
>('report/generate/localtsv', async (args, thunkAPI) => {
  // !! This function assumes that it is called only when the table is not empty. Said otherwise, data is never empty !!
  const messageKey = 'report_pending';

  trackReportDownload(`${capitalize(args.index)}Entity-${args.fileName}-tsv`);

  try {
    const formattedDate = format(new Date(), 'yyyy-MM-dd');
    const formattedFileName = `kidsfirst-${args.fileName ?? args.index}-table-${formattedDate}.tsv`;

    const visibleKeys = (args.cols || []).filter((c) => c.visible).map((c) => c.key);
    const visibleHeaders = args.headers.filter((h) => visibleKeys.includes(h.key));
    const visibleTitle = visibleHeaders.map((h) => h.title);
    const visibleRows = (args.rows || []).reduce(
      (rs, r) => [...rs, visibleHeaders.map((h) => r[h.key])],
      [],
    );

    const shapeIsOK = visibleRows.every((r: unknown[]) => r.length === visibleTitle.length);
    if (!shapeIsOK) {
      showErrorReportNotif(thunkAPI);
      return thunkAPI.rejectWithValue('error');
    }

    const formattedVisibleRows = visibleRows.map((row: string[]) => row.map((r) => (r ? r : '--')));
    const doc: string = [visibleTitle, ...formattedVisibleRows]
      .reduce((text, row) => text + '\n' + row.join('\t'), '')
      .trimStart();

    saveAs(new Blob([doc], { type: 'text/plain;charset=utf-8' }), formattedFileName);

    thunkAPI.dispatch(globalActions.destroyMessages([messageKey]));
  } catch {
    thunkAPI.dispatch(globalActions.destroyMessages([messageKey]));
    showErrorReportNotif(thunkAPI);
  }
});

const idField = (index: string) => {
  switch (index) {
    case INDEXES.PARTICIPANT:
      return 'participant_id';
    case INDEXES.FILE:
      return 'file_id';
    case INDEXES.BIOSPECIMEN:
      return 'sample_id';
    case INDEXES.STUDIES:
      return 'study_code';
    default:
      return undefined;
  }
};

const NON_EXPORTABLE_COLUMN_KEYS = ['lock'];

const buildVisibleColumns = (columns: ProColumnType[], columnStates: TColumnStates | undefined) => {
  const colStates = columnStates?.length
    ? columnStates
    : columns.map((col, index) => ({
        index,
        key: col.key as string,
        visible: col.defaultHidden !== true,
      }));

  return [...colStates]
    .filter(({ visible }) => !!visible)
    .filter(({ key }) => !NON_EXPORTABLE_COLUMN_KEYS.includes(key))
    .sort((a, b) => a.index - b.index)
    .map(({ key }) => ({
      field: key,
      header: getTitleFromColumns(columns, key),
    }));
};

const getTitleFromColumns = (columns: ProColumnType[], field: string) => {
  const column = columns.find(({ key }) => key === field);

  if (!column || (column.title && typeof column.title !== 'string')) {
    return startCase(field.replace(/\./g, ' '));
  }

  return column.title;
};

export { fetchReport, fetchTsvReport, generateLocalTsvReport };
