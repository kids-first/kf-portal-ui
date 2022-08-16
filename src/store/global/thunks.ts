import { createAsyncThunk } from '@reduxjs/toolkit';
import { ArrangerApi } from 'services/api/arranger';
import { IStatistics } from 'services/api/arranger/models';
import { RootState } from 'store/types';

const fetchStats = createAsyncThunk<IStatistics, void, { rejectValue: string; state: RootState }>(
  'arranger/fetch/stats',
  async (_, thunkAPI) => {
    const { data } = await ArrangerApi.fetchStatistics();

    return data!;
  },
  {
    condition: (_, { getState }) => {
      const { global } = getState();

      return global.stats === undefined;
    },
  },
);

export { fetchStats };
