import React, { Fragment } from 'react';
import { get, sumBy, uniq } from 'lodash';
import { injectState } from 'freactal';
import { compose, lifecycle, withState } from 'recompose';
import { withFormik } from 'formik';
import { withTheme } from 'emotion-theming';
import { css } from 'emotion';
import Spinner from 'react-spinkit';
import Query from '@arranger/components/dist/Query';

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
  queryStringWrapper,
  fileSizeToString,
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
    const filterToCheckedTypes = data =>
      data.filter(({ fileType }) => checkedFileTypes.includes(fileType));
    return (
      <DownloadManifestModal {...{ sqon, index, projectId, api }}>
        {({ setWarning }) => (
          <Query
            api={api}
            sqon={sqon}
            name={`CombinedFileStatsQuery`}
            query={queryStringWrapper(true)(
              [fileStat, fileSizeStat].map(stat => stat.fragment(stat.label)),
            )}
            index={index}
            projectId={projectId}
            render={({ data }) => {
              const participantsMemberCount = (participantIds || []).length;
              const participantsFilesCount = get(data, fileStat.rawDataAccessor(fileStat.label));
              const participantsFileSize = get(
                data,
                fileSizeStat.rawDataAccessor(fileSizeStat.label),
              );
              return (
                <div className={theme.column}>
                  <Fragment>
                    <ModalSubHeader>Participants Summary</ModalSubHeader>
                    <Table {...{ stats: participantStats }}>
                      <ManifestTableDataRow
                        {...{
                          fileType: 'All',
                          members: participantsMemberCount,
                          files: participantsFilesCount,
                          fileSize: fileSizeToString(participantsFileSize),
                        }}
                      />
                    </Table>
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
                        return (
                          <Fragment>
                            <ModalSubHeader>Family MembersSummary</ModalSubHeader>
                            {loading ? (
                              spinner
                            ) : (
                              <Fragment>
                                <Table {...{ stats: familyMemberStats }}>
                                  {fileTypeStats.map(({ fileType, members, files, fileSize }) => (
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
                                        fileSize: fileSizeToString(fileSize),
                                      }}
                                    />
                                  ))}
                                </Table>
                                <div className={dataTableStyle(theme)}>
                                  <ManifestTableDataRow
                                    className={`${theme.row} ${css`
                                      ${highLightRow(theme)};
                                    `}`}
                                    {...{
                                      fileType: 'TOTAL',
                                      members: uniq([
                                        ...participantIds,
                                        ...filterToCheckedTypes(fileTypeStats).reduce(
                                          (acc, { familyMembersKeys }) => [
                                            ...acc,
                                            ...familyMembersKeys,
                                          ],
                                          [],
                                        ),
                                      ]).length,
                                      files:
                                        participantsFilesCount +
                                        sumBy(filterToCheckedTypes(fileTypeStats), 'files'),
                                      fileSize: fileSizeToString(
                                        participantsFileSize +
                                          sumBy(filterToCheckedTypes(fileTypeStats), 'fileSize'),
                                      ),
                                    }}
                                  />
                                </div>
                              </Fragment>
                            )}
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
              );
            }}
          />
        )}
      </DownloadManifestModal>
    );
  },
);
