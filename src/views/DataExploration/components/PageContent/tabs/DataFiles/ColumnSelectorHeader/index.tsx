import React from 'react';
import intl from 'react-intl-universal';
import { Select } from 'antd';

import SearchLabel from 'components/uiKit/search/SearchLabel';

import { PresetOptions } from '../index';

import styles from './index.module.css';

type OwnProps = {
  activePreset: PresetOptions;
  handlePresetSelection: (preset: PresetOptions) => void;
};

const ColumnSelectorHeader = ({ activePreset, handlePresetSelection }: OwnProps) => {
  const options: Record<PresetOptions, string> = {
    datafiles: 'Data Files',
    imaging: 'Imaging',
  };

  return (
    <div className={styles.presetSelectorContainer}>
      <SearchLabel title={intl.get('global.proTable.columnPreset')} />
      <Select
        value={activePreset}
        onChange={(value) => handlePresetSelection(value as PresetOptions)}
        options={Object.keys(options).map((key) => ({
          value: key,
          label: options[key as PresetOptions],
        }))}
        size="small"
      />
    </div>
  );
};

export default ColumnSelectorHeader;
