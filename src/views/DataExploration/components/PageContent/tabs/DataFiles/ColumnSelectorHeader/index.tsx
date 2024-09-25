import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, MenuProps } from 'antd';

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

  const menuProps: MenuProps = {
    onClick: (e) => handlePresetSelection(e.key as PresetOptions),
    selectedKeys: [activePreset],
    items: Object.keys(options).map((key) => ({
      key,
      label: options[key as PresetOptions],
    })),
  };

  return (
    <div className={styles.presetSelectorContainer}>
      <Dropdown menu={menuProps} trigger={['click']} placement="bottomCenter">
        <Button size="small">
          {options[activePreset] || 'Select an option'} <DownOutlined />
        </Button>
      </Dropdown>
    </div>
  );
};

export default ColumnSelectorHeader;
