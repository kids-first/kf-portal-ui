/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react';
import { Button, Menu, Dropdown, Tooltip } from 'antd';
import '../../LoadShareSaveDeleteQuery/LoadShareSaveDeleteQuery.css';
import { FolderOpenOutlined } from '@ant-design/icons';
import { MenuClickEventHandler } from 'rc-menu/lib/interface';
import { VirtualStudy } from 'store/virtualStudiesTypes';

type OwnProps = {
  disabled: boolean;
  studies: Array<VirtualStudy>;
  selection?: VirtualStudy;
  classNameBtn?: string;
  loadSavedVirtualStudy: Function;
};

const LoadQuery: FunctionComponent<OwnProps> = (props) => {
  const { studies, selection, loadSavedVirtualStudy, disabled, classNameBtn = '' } = props;

  const onClickStudy: MenuClickEventHandler = (event) => loadSavedVirtualStudy(event.key);

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
