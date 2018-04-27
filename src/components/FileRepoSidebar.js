import React from 'react';
import styled, { css } from 'react-emotion';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';
import { injectState } from 'freactal';
import { Trans } from 'react-i18next';
import Spinner from 'react-spinkit';

import downloadIcon from '../assets/icon-download-white.svg';
import IconWithLoading from '../icons/IconWithLoading';
import Button from 'uikit/Button';
import Heading from 'uikit/Heading';
import LoadingOnClick from './LoadingOnClick';
import CavaticaCopyButton from 'components/cavatica/CavaticaCopyButton';

import PillInputWithButton from '../uikit/PillInputWithButton';
import { ColumnsState } from '@arranger/components/dist/DataTable';
import { downloadFileFromGen3 } from 'services/gen3';
import { GEN3 } from 'common/constants';
import { getFilesById } from 'services/arranger';
import Select, { SelectOptionDropdown, OptionDropdownWrapperCss } from '../uikit/Select';

import {
  downloadBiospecimen,
  clinicalDataParticipants,
  clinicalDataFamily,
} from '../services/downloadData';
import ParticipantManifestModal from './ParticipantManifestModal';
import FamilyManifestModal, { enhanceWithFamilyModalData } from './FamilyManifestModal';

const enhance = compose(injectState, withTheme);

const styles = {
  container: css`
    overflow-y: auto;
    background-color: #f4f5f8;
    box-shadow: 0 0 4.9px 0.2px #a0a0a3;
    border: solid 1px #c6c7cc;
    padding: 30px 5px 30px 15px;
    flex-grow: 0;
    flex-shrink: 1;
    width: 310px;
    min-width: 265px;
  `,
};

const getGen3UUIDs = async arrangerIds => {
  const fileData = await getFilesById({ ids: arrangerIds, fields: ['uuid'] });
  return fileData.map(file => file.node.uuid);
};

const downloadFile = async (arrangerIds, gen3Key) => {
  let files = await getGen3UUIDs(arrangerIds);
  let fileUUID = files && files.length > 0 ? files[0] : null;
  if (!fileUUID) throw new Error('Error retrieving File ID for the selected Row.');
  return downloadFileFromGen3(gen3Key, fileUUID);
};

const Divider = styled('div')`
  height: 1px;
  background-color: #d4d6dd;
  margin: 20px 10px 20px 0;
`;

const EnhancedFamilyManifestModal = enhanceWithFamilyModalData(familtManifestModalProps => (
  <FamilyManifestModal {...familtManifestModalProps} />
));

const spinner = (
  <Spinner
    fadeIn="none"
    name="circle"
    color="#a9adc0"
    style={{
      width: 20,
      height: 20,
      margin: 'auto',
      marginBottom: 20,
    }}
  />
);

const FileRepoSidebar = ({
  state,
  projectId,
  index,
  style,
  sqon,
  effects,
  theme,
  api,
  ...props
}) => {
  let gen3Key = state.integrationTokens[GEN3];
  let setToast = effects.setToast;
  return (
    <div
      css={`
        ${styles.container} ${style};
      `}
    >
      <Heading>
        <Trans>Actions</Trans>
      </Heading>
      <Trans
        i18nKey="fileRepoSidebar.noneSelected"
        css={`
          font-size: 14px;
        `}
      >
        If you have not selected any files, all files in your query will be included in the actions.
      </Trans>
      <Divider />
      <Heading>
        <Trans>Download</Trans>
      </Heading>
      <div>
        <Heading style={{ color: '#343434', fontSize: 14, marginBottom: 5 }}>
          File Manifests
        </Heading>
        <ColumnsState
          projectId={projectId}
          graphqlField="file"
          render={({ state }) => {
            const options = {
              'Participant only': () => {
                return effects.setModal({
                  title: 'Download Manifest',
                  component: (
                    <ParticipantManifestModal
                      api={api}
                      sqon={sqon}
                      index={index}
                      projectId={projectId}
                      columns={state.columns}
                    />
                  ),
                });
              },
              'Participant and family': () => {
                return effects.setModal({
                  title: 'Download Manifest (Participant and Family)',
                  component: (
                    <EnhancedFamilyManifestModal
                      api={api}
                      sqon={sqon}
                      index={index}
                      projectId={projectId}
                      columns={state.columns}
                    />
                  ),
                });
              },
            };
            return (
              <div
                css={`
                  display: flex;
                  margin-bottom: 13px;
                `}
              >
                <PillInputWithButton
                  options={options}
                  SelectComponent={({ setSelected, ...selectProps }) => {
                    return (
                      <Select
                        items={Object.keys(options)}
                        defaultSelectedItem="Participant only"
                        onChange={e => setSelected(e)}
                        OptionDropdownComponent={dropDownProps => {
                          const RecomposedSelectOptionDropdown = compose(
                            enhanceWithFamilyModalData,
                          )(
                            ({
                              dataTypes,
                              dataTypesAggregation,
                              participantAndFamilyMemberIdsAggregation,
                              ...familtManifestModalProps
                            }) => {
                              const loading =
                                !dataTypesAggregation.data ||
                                !participantAndFamilyMemberIdsAggregation.data ||
                                dataTypesAggregation.loading ||
                                participantAndFamilyMemberIdsAggregation.loading;
                              return loading ? (
                                <div
                                  css={`
                                    ${OptionDropdownWrapperCss} right: 0px;
                                    text-align: center;
                                  `}
                                >
                                  {spinner}
                                </div>
                              ) : (
                                <SelectOptionDropdown
                                  {...{
                                    ...dropDownProps,
                                    items: dataTypes.length
                                      ? ['Participant only', 'Participant and family']
                                      : ['Participant only'],
                                  }}
                                />
                              );
                            },
                          );
                          return (
                            <RecomposedSelectOptionDropdown
                              api={api}
                              sqon={sqon}
                              index={index}
                              projectId={projectId}
                              columns={state.columns}
                            />
                          );
                        }}
                        {...selectProps}
                      />
                    );
                  }}
                  render={({ loading }) => {
                    return (
                      <React.Fragment>
                        <IconWithLoading {...{ loading, icon: downloadIcon }} />
                        <Trans css={theme.uppercase}>Download</Trans>
                      </React.Fragment>
                    );
                  }}
                />
              </div>
            );
          }}
        />
        <ColumnsState
          projectId={projectId}
          graphqlField="file"
          render={({ state }) => {
            return (
              <div>
                <Heading style={{ color: '#343434', fontSize: 14, marginBottom: 5 }}>
                  <Trans>Selected File</Trans>
                </Heading>
                <div
                  css={`
                    display: flex;
                    margin-bottom: 13px;
                  `}
                >
                  <LoadingOnClick
                    onClick={() => {
                      downloadFile(props.selectedTableRows, gen3Key)
                        .then(url => {
                          let a = document.createElement('a');
                          console.log(url);
                          a.href = url;
                          a.download = url.split('/').slice(-1);
                          a.click();
                        })
                        .catch(err => {
                          setToast({
                            id: `${Date.now()}`,
                            action: 'success',
                            component: (
                              <div
                                css={`
                                  display: flex;
                                `}
                              >
                                <div
                                  css={`
                                    display: flex;
                                    flex-direction: column;
                                  `}
                                >
                                  <div
                                    css={`
                                      font-size: 16px;
                                    `}
                                  >
                                    <Trans>Failed!</Trans>
                                  </div>
                                  <Trans>Unable to download file</Trans>
                                  <div
                                    css={`
                                      color: 'red';
                                      margin-bottom: 20px;
                                      padding: 20px;
                                    `}
                                  >
                                    <span>
                                      <Trans i18nKey="fileRepoSidebar.missingDownloadPermissions">
                                        Your account does not have the required permission to
                                        download this file.
                                      </Trans>
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ),
                          });
                        });
                    }}
                    render={({ onClick, loading, disabled }) => {
                      return (
                        <Button
                          css={`
                            flex-grow: inhert;
                            padding-left: 15px;
                          `}
                          disabled={props.selectedTableRows.length !== 1 || loading}
                          onClick={onClick}
                          loading={loading}
                        >
                          <IconWithLoading icon={downloadIcon} />
                          <Trans css={theme.uppercase}>Download</Trans>
                        </Button>
                      );
                    }}
                  />
                </div>
              </div>
            );
          }}
        />
        <ColumnsState
          projectId={projectId}
          graphqlField="participant"
          render={({ state }) => {
            return (
              <div>
                <Heading style={{ color: '#343434', fontSize: 14, marginBottom: 5 }}>
                  <Trans>Reports</Trans>
                </Heading>
                <div
                  css={`
                    display: flex;
                    margin-bottom: 13px;
                  `}
                >
                  <PillInputWithButton
                    options={{
                      'Clinical (Participant)': clinicalDataParticipants({
                        sqon,
                        columns: state.columns,
                      }),
                      'Clinical (Family)': clinicalDataFamily({
                        sqon,
                        columns: state.columns,
                      }),
                      Biospecimen: downloadBiospecimen({ sqon, columns: state.columns }),
                    }}
                    render={({ loading }) => {
                      return (
                        <React.Fragment>
                          <IconWithLoading {...{ loading, icon: downloadIcon }} />
                          <Trans>Download</Trans>
                        </React.Fragment>
                      );
                    }}
                  />
                </div>
              </div>
            );
          }}
        />
      </div>
      <Divider />
      <Heading>
        <Trans>Data Analysis</Trans>
      </Heading>
      <CavaticaCopyButton {...props} />
    </div>
  );
};

export default enhance(FileRepoSidebar);
