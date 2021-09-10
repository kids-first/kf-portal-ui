import React from 'react';
import { FolderOpenOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Tooltip } from 'antd';
import { MenuClickEventHandler } from 'rc-menu/lib/interface';

import { Api } from 'store/apiTypes';
import { VirtualStudy } from 'store/virtualStudiesTypes';

type OwnProps = {
  disabled: boolean;
  studies: Array<VirtualStudy>;
  selection?: VirtualStudy;
  classNameBtn?: string;
  loadSavedVirtualStudy: Function;
  api: Api;
};

const LoadQuery = (props: OwnProps) => {
  const { studies, selection, loadSavedVirtualStudy, disabled, classNameBtn = '', api } = props;

  const onClickStudy: MenuClickEventHandler = (event) => loadSavedVirtualStudy(api, event.key);

  const generateMenu = () => {
    const filteredStudies =
      selection && !!selection.virtualStudyId
        ? studies.filter(({ virtualStudyId }) => selection.virtualStudyId !== virtualStudyId)
        : studies;

    return (
      <Menu onClick={onClickStudy}>
        {filteredStudies.map(({ virtualStudyId, name }) => (
          <Menu.Item key={virtualStudyId}>{name}</Menu.Item>
        ))}
      </Menu>
    );
  };

  return (
    <Tooltip title={<div>Open a saved virtual study</div>} className="button-group tooltip">
      <Dropdown
        disabled={disabled}
        overlay={generateMenu()}
        trigger={['click']}
        getPopupContainer={() => document.getElementById('anchor-open-vs-btn') as HTMLElement}
      >
        <Button id={'anchor-open-vs-btn'} className={classNameBtn} icon={<FolderOpenOutlined />}>
          Open
        </Button>
      </Dropdown>
    </Tooltip>
  );
};

export default LoadQuery;
