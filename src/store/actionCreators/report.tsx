import {
  CLEAR_MESSAGE,
  FAILURE,
  Message,
  MessageType,
  RE_INITIALIZE_STATE,
  ReportActionTypes,
  ReportConfig,
  REQUEST_MESSAGE,
  TOGGLE_LOADING,
} from '../reportTypes';
import generateReport, { checkAvailability, shouldCheckAvailability } from '../../services/report';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../rootState';

export const requestMessage = (message: Message): ReportActionTypes => ({
  type: REQUEST_MESSAGE,
  message,
});

export const failure = (error: Error): ReportActionTypes => ({
  type: FAILURE,
  error,
});

export const toggleLoading = (isLoading: boolean): ReportActionTypes => ({
  type: TOGGLE_LOADING,
  isLoading,
});

export const reInitializeState = (): ReportActionTypes => ({
  type: RE_INITIALIZE_STATE,
});

export const clearMessage = (): ReportActionTypes => ({
  type: CLEAR_MESSAGE,
});

export const fetchReport = (
  payload: ReportConfig,
): ThunkAction<void, RootState, null, ReportActionTypes> => async (dispatch) => {
  dispatch(toggleLoading(true));
  try {
    dispatch(
      requestMessage({
        content: 'Please wait while we generate your report',
        duration: 0,
        type: MessageType.LOADING,
      }),
    );
    const { sqon, name } = payload;
    await generateReport({
      sqon,
      name,
    });
    dispatch(clearMessage());
  } catch (error) {
    dispatch(clearMessage());
    dispatch(failure(error));
  } finally {
    dispatch(toggleLoading(false));
  }
};

export const fetchReportIfNeeded = (
  payload: ReportConfig,
): ThunkAction<Promise<void>, RootState, null, ReportActionTypes> => async (dispatch) => {
  const { sqon, name } = payload;

  let shouldFetch = true;
  dispatch(toggleLoading(true));
  if (shouldCheckAvailability(name)) {
    dispatch(
      requestMessage({
        content: 'Checking for availability',
        duration: 0,
        type: MessageType.LOADING,
      }),
    );

    shouldFetch = await checkAvailability(name, sqon);
    dispatch(clearMessage());
    if (!shouldFetch) {
      dispatch(
        requestMessage({
          content: `This report is not available`,
          duration: 3.5,
          type: MessageType.WARN,
        }),
      );
    }
  }
  dispatch(toggleLoading(false));
  if (shouldFetch) {
    dispatch(fetchReport(payload));
  }
};
