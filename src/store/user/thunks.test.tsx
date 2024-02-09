import { cloneDeep } from 'lodash';
import { cleanupConfig } from './thunks';
import {
  emptyUserConfig,
  updatedConfigDashboard,
  updatedConfigParticipant,
  updatedConfigSummary,
  updatedConfigVariant,
  userConfig,
  userConfigWithoutVariant,
} from './thunksTestData';

describe('store/user/thunks', () => {
  describe('cleanupConfig', () => {
    it('should return and empty object if config and his update are empty', () => {
      const result = cleanupConfig(emptyUserConfig, emptyUserConfig);
      expect(result).toEqual({});
    });
    it('should return updated config if config is empty', () => {
      const result = cleanupConfig(updatedConfigSummary, {});
      expect(result).toEqual(updatedConfigSummary);
    });
    it('should return merged config if config not contains the updated config part', () => {
      const result = cleanupConfig(updatedConfigVariant, userConfigWithoutVariant);
      const mergedConfig = { ...cloneDeep(userConfigWithoutVariant), ...updatedConfigVariant };
      expect(result).toEqual(mergedConfig);
    });

    it('should return merged config if config and updated summary config are not empty', () => {
      const result = cleanupConfig(updatedConfigSummary, userConfig);
      const mergedConfig = cloneDeep(userConfig);
      mergedConfig.data_exploration.summary = updatedConfigSummary.data_exploration.summary;
      expect(result).toEqual(mergedConfig);
    });
    it('should return merged config if config and updated tables config are not empty', () => {
      const result = cleanupConfig(updatedConfigParticipant, userConfig);
      const mergedConfig = cloneDeep(userConfig);
      mergedConfig.data_exploration.tables.participants =
        updatedConfigParticipant.data_exploration.tables.participants;
      expect(result).toEqual(mergedConfig);
    });
    it('should return merged config if config and updated variants config are not empty', () => {
      const result = cleanupConfig(updatedConfigVariant, userConfig);
      const mergedConfig = cloneDeep(userConfig);
      mergedConfig.variants = updatedConfigVariant.variants;
      expect(result).toEqual(mergedConfig);
    });
    it('should return merged config if config and updated dashboard config are not empty', () => {
      const result = cleanupConfig(updatedConfigDashboard, userConfig);
      const mergedConfig = cloneDeep(userConfig);
      mergedConfig.dashboard = updatedConfigDashboard.dashboard;
      expect(result).toEqual(mergedConfig);
    });
  });
});
