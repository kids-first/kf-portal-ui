import React, { Fragment } from 'react';
import { injectState } from 'freactal';
import { compose, lifecycle, withState } from 'recompose';
import { withFormik } from 'formik';
import { withTheme } from 'emotion-theming';
import { css } from 'emotion';
import Spinner from 'react-spinkit';

import DownloadManifestModal, { DownloadManifestModalFooter } from '../DownloadManifestModal';
import { ModalSubHeader } from '../Modal';
import { fileManifestParticipantsAndFamily } from '../../services/downloadData';
import { withApi } from 'services/api';
import { generateFamilyManifestModalProps } from './queries';
import FamilyDataTypesStatsQuery from './FamilyDataTypesStatsQuery';
import {
  FileRepoStatsQuery,
  familyStat,
  participantsStat,
  fileStat,
  fileSizeStat,
} from 'components/Stats';
import { dataTableStyle, highLightRow } from './style';

const sqonForDownload = ({ values, familyMemberIds, sqon }) => {
  const selectedDataTypes = Object.entries(values)
    .filter(([, val]) => val)
    .map(([key]) => key);
  return sqon
    ? {
        op: 'or',
        content: [
          sqon,
          {
            op: 'and',
            content: [
              {
                op: 'in',
                content: { field: 'data_type', value: selectedDataTypes },
              },
              {
                op: 'in',
                content: { field: 'participants.kf_id', value: familyMemberIds },
              },
            ],
          },
        ],
      }
    : sqon;
};

const ManifestTableDataRow = compose(withTheme)(
  ({ theme, fileType, members, files, fileSize, isChecked, showCheckbox, ...rest }) => (
    <div className={`row ${theme.row}`} {...rest}>
      <div className={`tableCell ${theme.row}`}>
        {showCheckbox && <input type="checkbox" checked={isChecked} className={`left checkbox`} />}
        {fileType}
      </div>
      <div className={`tableCell ${theme.row}`}>{members}</div>
      <div className={`tableCell ${theme.row}`}>{files}</div>
      <div className={`tableCell ${theme.row}`}>{fileSize}</div>
    </div>
  ),
);

const Table = compose(withTheme)(({ theme, stats, children }) => (
  <div className={`${theme.column} ${dataTableStyle(theme)}`}>
    <div className={`row ${theme.row}`}>
      <div className={`tableCell ${theme.column}`}>Data Types</div>
      {stats.map(({ label, icon }) => (
        <div className={`tableCell ${theme.row}`}>
          <div className={`left`}>{icon}</div> {label}
        </div>
      ))}
    </div>
    {children}
  </div>
));

const spinner = (
  <Spinner
    fadeIn="none"
    name="circle"
    color="#a9adc0"
    style={{
      width: 30,
      height: 30,
      margin: 'auto',
      marginBottom: 20,
    }}
  />
);

export default compose(
  withTheme,
  injectState,
  withApi,
  lifecycle({
    componentDidMount() {
      generateFamilyManifestModalProps({
        api: this.props.api,
        sqon: this.props.sqon,
      }).then(x => this.setState(x));
    },
  }),
  withFormik({
    mapPropsToValues: ({ dataTypes }) =>
      (dataTypes || []).reduce((acc, bucket) => ({ ...acc, [bucket.key]: false }), {}),
    handleSubmit: async (
      values,
      {
        props: { familyMemberIds, sqon, columns, effects: { unsetModal } },
        setSubmitting,
        setErrors,
      },
    ) => {
      fileManifestParticipantsAndFamily({
        sqon: sqonForDownload({ sqon, values, familyMemberIds }),
        columns: columns,
      })().then(async profile => unsetModal(), errors => setSubmitting(false));
    },
  }),
  withState('isDisabled', 'setIsDisabled', false),
  withState('checkedFileTypes', 'setCheckedFileTypes', []),
)(
  ({
    theme,
    familyMemberIds,
    participantIds,
    dataTypes,
    sqon,
    index,
    projectId,
    values,
    submitForm,
    isSubmitting,
    isDisabled,
    setIsDisabled,
    checkedFileTypes,
    setCheckedFileTypes,
    api,
  }) => {
    const participantStats = [participantsStat, fileStat, fileSizeStat];
    const familyMemberStats = [
      { icon: familyStat.icon, label: 'Family Members' },
      fileStat,
      fileSizeStat,
    ];
    return (
      <DownloadManifestModal {...{ sqon, index, projectId, api }}>
        {({ setWarning }) => (
          <FileRepoStatsQuery
            api={api}
            sqon={sqon}
            index={index}
            projectId={projectId}
            stats={participantStats}
            render={({
              [participantStats[0].label]: participantsMemberCount,
              [participantStats[1].label]: participantsFilesCount,
              [participantStats[2].label]: participantsFileSize,
            }) => (
              <div className={theme.column}>
                <Fragment>
                  <ModalSubHeader>Family Summary</ModalSubHeader>
                  <Table {...{ stats: participantStats }}>
                    <ManifestTableDataRow
                      {...{
                        fileType: 'All',
                        members: participantsMemberCount,
                        files: participantsFilesCount,
                        fileSize: participantsFileSize,
                      }}
                    />
                  </Table>
                </Fragment>
                {(dataTypes || []).length ? (
                  <Fragment>
                    <ModalSubHeader>Participants Summary</ModalSubHeader>
                    <Table {...{ stats: familyMemberStats }}>
                      <FamilyDataTypesStatsQuery
                        {...{
                          dataTypes,
                          participantIds,
                          projectId,
                          isDisabled,
                          values,
                        }}
                      >
                        {({ loading, data }) =>
                          loading
                            ? spinner
                            : data.map(({ fileType, members, files, fileSize }) => (
                                <ManifestTableDataRow
                                  {...{
                                    showCheckbox: true,
                                    onClick: e => {
                                      setCheckedFileTypes(
                                        checkedFileTypes.includes(fileType)
                                          ? checkedFileTypes.filter(type => type !== fileType)
                                          : [...checkedFileTypes, fileType],
                                      );
                                    },
                                    isChecked: checkedFileTypes.includes(fileType),
                                    fileType,
                                    members,
                                    files,
                                    fileSize,
                                  }}
                                />
                              ))
                        }
                      </FamilyDataTypesStatsQuery>
                    </Table>
                    <div className={dataTableStyle(theme)}>
                      <ManifestTableDataRow
                        className={`${theme.row} ${css`
                          ${highLightRow(theme)};
                        `}`}
                        {...{
                          fileType: 'TOTAL',
                          members: participantsMemberCount,
                          files: participantsFilesCount,
                          fileSize: participantsFileSize,
                        }}
                      />
                    </div>
                  </Fragment>
                ) : null}
                <DownloadManifestModalFooter
                  {...{
                    api,
                    sqon: sqonForDownload({ sqon, values, familyMemberIds }),
                    onManifestGenerated: () => setIsDisabled(true),
                    projectId,
                    setWarning,
                    onDownloadClick: submitForm,
                    downloadLoading: isSubmitting,
                  }}
                />
              </div>
            )}
          />
        )}
      </DownloadManifestModal>
    );
  },
);
