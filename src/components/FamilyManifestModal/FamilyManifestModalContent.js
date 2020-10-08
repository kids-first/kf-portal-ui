import React from 'react';
import sumBy from 'lodash/sumBy';
import uniq from 'lodash/uniq';
import { compose, lifecycle, withState } from 'recompose';
import filesize from 'filesize';
import formatNumber from '@kfarranger/components/dist/utils/formatNumber';
import { ColumnsState } from '@kfarranger/components/dist/DataTable';
import { withApi } from 'services/api';
import { generateFamilyManifestModalProps } from './queries';
import FamilyDataTypesStatsQuery from './FamilyDataTypesStatsQuery';
import { participantStatsHeaderTotal, familyMemberStatsHeader } from './statVisuals';
import Footer from './Footer';
import ParticipantsSection from './ParticipantsSection';
import { Typography, Spin, Table } from 'antd';
import { toKebabCase } from '../../utils';

const { Paragraph } = Typography;

const fileSizeToString = (fileSize) => filesize(fileSize || 0).toUpperCase();

const spinner = (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
    }}
  >
    <Spin size={'large'} />
  </div>
);

export default compose(
  withApi,
  lifecycle({
    state: { loading: true },
    componentDidMount() {
      generateFamilyManifestModalProps({
        api: this.props.api,
        sqon: this.props.sqon,
      }).then((x) =>
        this.setState({
          ...x,
          loading: false,
        }),
      );
    },
  }),
  withState('checkedFileTypes', 'setCheckedFileTypes', []),
)(
  ({
    loading,
    participantIds,
    dataTypes,
    participantFilesCount,
    participantFilesSize,
    sqon,
    projectId,
    isSubmitting,
    checkedFileTypes,
    setCheckedFileTypes,
    api,
    onCloseCb,
  }) => {
    if (loading) {
      return spinner;
    }

    const participantsMemberCount = (participantIds || []).length;

    const filterToCheckedTypes = (data) =>
      data.filter(({ fileType }) => checkedFileTypes.includes(fileType));

    const isFamilyMemberFilesAvailable = (dataTypes || []).length > 0;

    return (
      <ColumnsState
        projectId={projectId}
        graphqlField="file"
        render={({ state: { columns } }) => {
          if (!isFamilyMemberFilesAvailable) {
            return (
              <>
                <ParticipantsSection
                  isFamilyMemberFilesAvailable={isFamilyMemberFilesAvailable}
                  participantsMemberCount={participantsMemberCount}
                  participantFilesCount={participantFilesCount}
                  size={fileSizeToString(participantFilesSize)}
                  checkIconClassName={`checkMark`}
                />
                <br />
                <Footer
                  participantIds={participantIds}
                  className={'wrapper-modal-footer'}
                  onCloseCb={onCloseCb}
                  columns={columns}
                  sqon={sqon}
                  checkedFileTypes={checkedFileTypes}
                  loading={isSubmitting}
                />
              </>
            );
          }

          return (
            <FamilyDataTypesStatsQuery
              {...{
                api,
                dataTypes,
                participantIds,
                projectId,
                // eslint-disable-next-line react/display-name
                render: ({ loading: loadingFileTypeStats, fileTypeStats }) => {
                  if (loadingFileTypeStats) {
                    return spinner;
                  }

                  const uniqueParticipantsAndFamilyMemberIds = uniq([
                    ...participantIds,
                    ...(fileTypeStats
                      ? filterToCheckedTypes(fileTypeStats).reduce(
                          (acc, { familyMembersKeys }) => [...acc, ...familyMembersKeys],
                          [],
                        )
                      : []),
                  ]);

                  return (
                    <>
                      <ParticipantsSection
                        isFamilyMemberFilesAvailable={isFamilyMemberFilesAvailable}
                        participantsMemberCount={participantsMemberCount}
                        participantFilesCount={participantFilesCount}
                        size={fileSizeToString(participantFilesSize)}
                        checkIconClassName={`checkMark`}
                      />
                      <br />
                      <Paragraph>
                        {
                          // eslint-disable-next-line max-len
                          ' - the participants in your query have related family member data. To include the family data in the manifest, select your desired data types below'
                        }
                      </Paragraph>
                      <Table
                        title={() => 'Family Summary'}
                        footer={() => ''}
                        scroll={{ y: 200 }}
                        columns={familyMemberStatsHeader}
                        rowSelection={{
                          type: 'checkbox',
                          onChange: (selectedRowKeys, selectedRows) => {
                            setCheckedFileTypes(selectedRows.map((row) => row.datatypes));
                          },
                        }}
                        dataSource={fileTypeStats.map(({ fileType, members, files, fileSize }) => ({
                          key: toKebabCase(fileType),
                          datatypes: fileType,
                          familymembers: formatNumber(members),
                          files: formatNumber(files),
                          size: fileSizeToString(fileSize),
                        }))}
                        pagination={false}
                      />
                      <br />
                      <Table
                        title={() => 'Total'}
                        footer={() => ''}
                        columns={participantStatsHeaderTotal}
                        dataSource={[
                          {
                            key: '1',
                            participants: uniqueParticipantsAndFamilyMemberIds.length,
                            files:
                              participantFilesCount +
                              sumBy(filterToCheckedTypes(fileTypeStats), 'files'),
                            size: fileSizeToString(
                              participantFilesSize +
                                sumBy(filterToCheckedTypes(fileTypeStats), 'fileSize'),
                            ),
                          },
                        ]}
                        pagination={false}
                      />
                      <br />
                      <Footer
                        participantIds={uniqueParticipantsAndFamilyMemberIds}
                        className={'wrapper-modal-footer'}
                        onCloseCb={onCloseCb}
                        columns={columns}
                        sqon={sqon}
                        checkedFileTypes={checkedFileTypes}
                        loading={isSubmitting}
                      />
                    </>
                  );
                },
              }}
            />
          );
        }}
      />
    );
  },
);
