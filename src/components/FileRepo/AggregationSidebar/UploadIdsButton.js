import React from 'react';
import { css } from 'emotion';
import { Trans } from 'react-i18next';

import { toggleSQON } from '@arranger/components/dist/SQONView/utils';

import UploadIdsModal from 'components/UploadIdsModal';
import { LightButton } from 'uikit/Button';
import Select from 'uikit/Select';

const UploadIdsButton = ({ theme, state, effects, setSQON, ...props }) => (
  <div
    className={css`
      display: flex;
      justify-content: flex-end;
      margin-top: 10px;
    `}
  >
    <LightButton
      className={css`
        ${theme.uppercase};
        border-top-right-radius: 0px;
        border-bottom-right-radius: 0px;
      `}
      onClick={() =>
        effects.setModal({
          title: 'Upload a List of Identifiers',
          component: <UploadIdsModal {...{ ...props, setSQON }} closeModal={effects.unsetModal} />,
        })
      }
    >
      <Trans>Upload Ids</Trans>
    </LightButton>
    <Select
      className={css`
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
        border-left: none;
        padding-left: 0;
      `}
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
  </div>
);

export default UploadIdsButton;
