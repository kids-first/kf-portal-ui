import React, { Fragment } from 'react';
import { sumBy, uniq } from 'lodash';
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
  familyStat,
  participantsStat,
  fileStat,
  fileSizeStat,
  fileSizeToString,
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

const ManifestTableDataRow = compose(withTheme)(
  ({ theme, fileType, members, files, fileSize, isChecked, showCheckbox, className, ...rest }) => (
    <div className={`row ${theme.row} ${className}`} {...rest}>
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

const Table = compose(withTheme)(({ theme, stats, className, children }) => (
  <div className={`${theme.column} ${className} ${dataTableStyle(theme)}`}>
    <div className={`row ${theme.row}`}>
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

const Section = ({ children }) => (
  <section
    className={css`
      margin-top: 20px;
      margin-bottom: 20px;
    `}
  >
    {children}
  </section>
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
    participantFilesCount,
    participantFilesSize,
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
    const participantsMemberCount = (participantIds || []).length;

    const filterToCheckedTypes = data =>
      data.filter(({ fileType }) => checkedFileTypes.includes(fileType));
    return (
      <DownloadManifestModal {...{ sqon, index, projectId, api }}>
        {({ setWarning }) => (
          <div className={theme.column}>
            <Fragment>
              <Section>
                <ModalSubHeader>Participants Summary</ModalSubHeader>
                <Table {...{ stats: [{ icon: null, label: 'Data Types' }, ...participantStats] }}>
                  <ManifestTableDataRow
                    {...{
                      fileType: 'All',
                      members: participantsMemberCount,
                      files: participantFilesCount,
                      fileSize: fileSizeToString(participantFilesSize),
                    }}
                  />
                </Table>
              </Section>
            </Fragment>
            {(dataTypes || []).length ? (
              <FamilyDataTypesStatsQuery
                {...{
                  dataTypes,
                  participantIds,
                  projectId,
                  isDisabled,
                  values,
                }}
              >
                {({ loading, data: fileTypeStats = [] }) => {
                  return loading ? (
                    spinner
                  ) : (
                    <Fragment>
                      <Section>
                        <ModalSubHeader>Family Summary</ModalSubHeader>
                        <Table
                          {...{
                            stats: [{ icon: null, label: 'Data Types' }, ...familyMemberStats],
                          }}
                        >
                          {fileTypeStats.map(({ fileType, members, files, fileSize }, i) => (
                            <ManifestTableDataRow
                              {...{
                                key: i,
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
                                fileSize: fileSizeToString(fileSize),
                              }}
                            />
                          ))}
                        </Table>
                      </Section>
                      <Section>
                        <Table
                          className={`total`}
                          {...{
                            stats: [
                              {
                                icon: null,
                                label: 'TOTAL',
                              },
                              {
                                icon: participantsStat.icon,
                                label: uniq([
                                  ...participantIds,
                                  ...filterToCheckedTypes(fileTypeStats).reduce(
                                    (acc, { familyMembersKeys }) => [...acc, ...familyMembersKeys],
                                    [],
                                  ),
                                ]).length,
                              },
                              {
                                icon: fileStat.icon,
                                label:
                                  participantFilesCount +
                                  sumBy(filterToCheckedTypes(fileTypeStats), 'files'),
                              },
                              {
                                icon: fileSizeStat.icon,
                                label: fileSizeToString(
                                  participantFilesSize +
                                    sumBy(filterToCheckedTypes(fileTypeStats), 'fileSize'),
                                ),
                              },
                            ],
                          }}
                        />
                      </Section>
                    </Fragment>
                  );
                }}
              </FamilyDataTypesStatsQuery>
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
