/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react';
import UploadIdsModal from 'components/UploadIdsModal';
import { Button } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
// @ts-ignore
import { compose } from 'recompose';
import './aggregationSideBar.css';
// @ts-ignore
import { injectState } from 'freactal';
import { EsIndex, ProjectId } from 'store/esTypes';
import { setSqonArrangerCB } from 'store/sqon';
import { ModalStateEffects } from 'store/freactalModalState';

type OwnProps = {
  graphqlField: string;
  whitelist: Array<string>;
  uploadableFields: Array<string>;
  setSQON: setSqonArrangerCB;
  index: EsIndex;
  matchboxPlaceholderText: string;
  projectId: ProjectId;
  searchFields?: string;
};

type FreactalProps = {
  effects: ModalStateEffects;
};

type Props = OwnProps & FreactalProps;

const UploadIdsButton: FunctionComponent<Props> = ({
  effects,
  searchFields,
  matchboxPlaceholderText,
  setSQON,
  graphqlField,
  index,
  projectId,
  uploadableFields,
  whitelist,
}) => (
  <div className={'upload-btn-container'}>
    <CloudUploadOutlined className={'upload-icon ant-btn-link'} />
    <Button
      size={'small'}
      type="link"
      onClick={() =>
        effects.setModal({
          title: 'Upload a List of Identifiers',
          component: (
            <UploadIdsModal
              placeholderText={matchboxPlaceholderText}
              {...{
                graphqlField,
                index,
                projectId,
                uploadableFields,
                whitelist,
                setSQON,
                searchFields,
              }}
              closeModal={effects.unsetModal}
            />
          ),
        })
      }
    >
      {'upload your list of ids'}
    </Button>
  </div>
);

export default compose(injectState)(UploadIdsButton);
