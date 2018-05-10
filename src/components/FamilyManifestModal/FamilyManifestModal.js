import React, { Fragment } from 'react';
import { injectState } from 'freactal';
import { compose, lifecycle, withState } from 'recompose';
import { withFormik } from 'formik';
import { withTheme } from 'emotion-theming';
import { css } from 'emotion';

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
import { dataTableStyle } from './style';

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

const ManifestTableDataRow = compose(withTheme)(({ theme, fileType, members, files, fileSize }) => (
  <div className={`row ${theme.row}`}>
    <div className={`tableCell ${theme.row}`}>{fileType}</div>
    <div className={`tableCell ${theme.row}`}>{members}</div>
    <div className={`tableCell ${theme.row}`}>{files}</div>
    <div className={`tableCell ${theme.row}`}>{fileSize}</div>
  </div>
));

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
          <div className={theme.column}>
            <Fragment>
              <ModalSubHeader>Family Summary</ModalSubHeader>
              <Table {...{ stats: participantStats }}>
                <FileRepoStatsQuery
                  api={api}
                  sqon={sqon}
                  index={index}
                  projectId={projectId}
                  stats={participantStats}
                  render={data => (
                    <ManifestTableDataRow
                      {...{
                        fileType: 'All',
                        members: data[participantStats[0].label],
                        files: data[participantStats[1].label],
                        fileSize: data[participantStats[2].label],
                      }}
                    />
                  )}
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
                    {props => <ManifestTableDataRow {...props} />}
                  </FamilyDataTypesStatsQuery>
                </Table>
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
      </DownloadManifestModal>
    );
  },
);
