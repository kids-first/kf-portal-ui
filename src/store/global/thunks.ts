import { createAsyncThunk } from '@reduxjs/toolkit';

import { ArrangerApi } from 'services/api/arranger';
import { IStatistics } from 'services/api/arranger/models';
import { RootState } from 'store/types';

const fetchStats = createAsyncThunk<IStatistics, void, { rejectValue: string; state: RootState }>(
  'arranger/fetch/stats',
  async () => {
    const { data: statistics } = await ArrangerApi.fetchStatistics();
    const { data: studiesStatistics } = await ArrangerApi.fetchStudiesStatistics();

    const data: IStatistics = {
      ...statistics!,
      studiesStatistics: studiesStatistics!,
    };

    return data;
  },
  {
    condition: (_, { getState }) => {
      const { global } = getState();

      return global.stats === undefined;
    },
  },
);

export { fetchStats };
