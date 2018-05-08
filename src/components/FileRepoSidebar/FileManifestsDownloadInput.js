import React, { Fragment } from 'react';
import { Trans } from 'react-i18next';
import { ColumnsState } from '@arranger/components/dist/DataTable';

import downloadIcon from 'assets/icon-download-white.svg';
import IconWithLoading from 'icons/IconWithLoading';

import PillInputWithLoadingOptionsAndButton from 'uikit/PillInputWithLoadingOptionsAndButton';

import ParticipantManifestModal from '../ParticipantManifestModal';
import FamilyManifestModal, { generateFamilyManifestModalProps } from '../FamilyManifestModal';

export default ({ api, sqon, index, projectId, theme, effects }) => (
  <div
    css={`
      display: flex;
      margin-bottom: 13px;
    `}
  >
    <ColumnsState
      projectId={projectId}
      graphqlField="file"
      render={({ state: { columns } }) => {
        return (
          <PillInputWithLoadingOptionsAndButton
            options={{
              'Participant only': {
                onSelected: () =>
                  effects.setModal({
                    title: 'Download Manifest',
                    component: (
                      <ParticipantManifestModal
                        {...{
                          api,
                          sqon,
                          index,
                          projectId,
                          columns,
                        }}
                      />
                    ),
                  }),
              },
              'Participant and family': {
                tooltip: `No file was found for family members`,
                onDropdownOpen: async () => {
                  const familyManifestModalProps = await generateFamilyManifestModalProps({
                    api,
                    sqon,
                  });
                  return (familyManifestModalProps.dataTypes || []).length;
                },
                onSelected: () =>
                  effects.setModal({
                    title: 'Download Manifest (Participant and Family)',
                    component: (
                      <FamilyManifestModal {...{ api, sqon, index, projectId, columns }} />
                    ),
                  }),
              },
            }}
            render={({ loading }) => {
              return (
                <Fragment>
                  <IconWithLoading {...{ loading, icon: downloadIcon }} />
                  <Trans css={theme.uppercase}>Download</Trans>
                </Fragment>
              );
            }}
          />
        );
      }}
    />
  </div>
);
