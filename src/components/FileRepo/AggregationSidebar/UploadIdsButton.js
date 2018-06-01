import React from 'react';
import { css } from 'emotion';
import { Trans } from 'react-i18next';
import styled from 'react-emotion';

import { toggleSQON } from '@arranger/components/dist/SQONView/utils';

import UploadIdsModal from 'components/UploadIdsModal';
import { LightButton } from 'uikit/Button';
import Select from 'uikit/Select';
import Row from 'uikit/Row';

const UploadButton = styled(LightButton)`
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-top-left-radius: 100px;
  border-bottom-left-radius: 100px;
  margin: 0px;
  font-size: 9px;
  padding-left: 5px;
  padding-right: 5px;
`;

const IdSelect = styled(Select)`
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  border-top-right-radius: 100px;
  border-bottom-right-radius: 100px;
  border-left: none;
  padding-left: 0;
  &:hover {
    background: ${({ theme }) => theme.tertiary};
  }
`;

const UploadIdsButton = ({ theme, state, effects, setSQON, ...props }) => (
  <Row>
    <UploadButton
      onClick={() =>
        effects.setModal({
          title: 'Upload a List of Identifiers',
          component: <UploadIdsModal {...{ ...props, setSQON }} closeModal={effects.unsetModal} />,
        })
      }
    >
      <Trans>Upload Ids</Trans>
    </UploadButton>
    <IdSelect
      align="right"
      items={state.loggedInUser.sets.map(x => x.setId)}
      itemContainerClassName={css`
        padding: 0px;
        box-shadow: 1px 1px 1px 0px rgba(0, 0, 0, 0.43);
      `}
      itemClassName={css`
        &:hover {
          background-color: ${theme.optionSelected};
        }
      `}
      onChange={(setId, { clearSelection }) => {
        if (setId) {
          setSQON(
            toggleSQON(
              {
                op: 'and',
                content: [
                  {
                    op: 'in',
                    content: {
                      field: 'kf_id',
                      value: [`set_id:${setId}`],
                    },
                  },
                ],
              },
              props.sqon,
            ),
          );
        }
        clearSelection();
      }}
    />
  </Row>
);

export default UploadIdsButton;
