import React from 'react';
import { get } from 'lodash';
import { compose, withProps, withState } from 'recompose';
import { withFormik } from 'formik';
import { injectState } from 'freactal/lib/inject';
import Spinner from 'react-spinkit';

import { withQuery } from '@arranger/components';

import { fileManifestParticipantsAndFamily } from '../../services/downloadData';
import DataTypeOption from './DataTypeOption';
import DownloadManifestModal, { DownloadManifestModalFooter } from '../DownloadManifestModal';
import { ModalSubHeader } from '../Modal';
import Query from '@arranger/components/dist/Query';

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

const enhance = compose(
  injectState,
  withQuery(({ sqon, projectId }) => ({
    renderError: true,
    projectId,
    key: 'familyMemberIdAggregation',
    query: `
      query dataTypes($sqon: JSON) {
        file {
          aggregations(filters: $sqon) {
            participants__family__family_members__kf_id {
              buckets {
                doc_count
                key
              }
            }
          }
        }
      }
    `,
    variables: { sqon },
  })),
  withProps(({ familyMemberIdAggregation: { data } }) => ({
    familyMemberIds: (
      get(data, 'file.aggregations.participants__family__family_members__kf_id.buckets') || []
    ).map(b => b.key),
  })),
  withQuery(({ sqon, projectId, familyMemberIds, familyMemberIdAggregation }) => ({
    shouldFetch: !familyMemberIdAggregation.loading,
    renderError: true,
    projectId,
    key: 'familyMemberWithoutParticipantIdAggregation',
    query: `
      query dataTypes($sqon: JSON) {
        file {
          aggregations(filters: $sqon) {
            participants__family__family_members__kf_id {
              buckets {
                doc_count
                key
              }
            }
          }
        }
      }
    `,
    variables: {
      sqon: {
        op: 'and',
        content: [
          {
            op: 'in',
            content: { field: 'participants.kf_id', value: familyMemberIds },
          },
          ...(sqon ? [{ op: 'not', content: [sqon] }] : []),
        ],
      },
    },
  })),
  withProps(({ familyMemberWithoutParticipantIdAggregation: { data } }) => ({
    familyMemberWithoutParticipantIds: (
      get(data, 'file.aggregations.participants__family__family_members__kf_id.buckets') || []
    ).map(b => b.key),
  })),
  withProps(({ familyMemberIds, familyMemberWithoutParticipantIds }) => ({
    finalFamilyMemberIds: familyMemberWithoutParticipantIds.length
      ? familyMemberWithoutParticipantIds
      : familyMemberIds,
  })),
  withQuery(
    ({ sqon, projectId, finalFamilyMemberIds, familyMemberWithoutParticipantIdAggregation }) => ({
      shouldFetch: !familyMemberWithoutParticipantIdAggregation.loading,
      renderError: true,
      projectId,
      key: 'dataTypesAggregation',
      query: `
      query dataTypes($sqon: JSON) {
        file {
          aggregations(filters: $sqon) {
            data_type {
              buckets {
                doc_count
                key
              }
            }
          }
        }
      }
    `,
      variables: {
        sqon: {
          op: 'and',
          content: [
            {
              op: 'in',
              content: {
                field: 'participants.kf_id',
                value: finalFamilyMemberIds,
              },
            },
          ],
        },
      },
    }),
  ),
  withProps(({ dataTypesAggregation: { data } }) => ({
    dataTypes: get(data, 'file.aggregations.data_type.buckets') || [],
  })),
  withFormik({
    mapPropsToValues: ({ dataTypes }) =>
      dataTypes.reduce((acc, bucket) => ({ ...acc, [bucket.key]: false }), {}),
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
);

const FamilyManifestModal = ({
  dataTypesAggregation,
  familyMemberIds,
  finalFamilyMemberIds,
  familyMemberIdAggregation,
  familyMemberWithoutParticipantIdAggregation,
  dataTypes,
  sqon,
  index,
  projectId,
  values,
  submitForm,
  isSubmitting,
  isDisabled,
  setIsDisabled,
}) => {
  const loading =
    !dataTypes.length ||
    !dataTypesAggregation.data ||
    dataTypesAggregation.loading ||
    familyMemberIdAggregation.loading ||
    familyMemberWithoutParticipantIdAggregation.loading;
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
  return (
    <DownloadManifestModal {...{ sqon, index, projectId }}>
      {({ setWarning }) => (
        <div>
          <ModalSubHeader>
            Select the data types you would like to download for the family members:
          </ModalSubHeader>
          {loading ? (
            spinner
          ) : (
            <Query
              renderError
              projectId={projectId}
              name={`dataTypeQuery`}
              query={`
                query dataTypes(${dataTypes
                  .map((dataType, i) => `$sqon${i}: JSON, $sqon${i}family: JSON`)
                  .join(', ')}) {
                  file {
                    ${dataTypes
                      .map(
                        (dataType, i) => `
                        ${dataType.key.replace(
                          /[^\da-z]/gi,
                          '',
                        )}: aggregations(filters: $sqon${i}) {
                          file_size {
                            stats {
                              sum
                            }
                          }
                        }
                        ${dataType.key.replace(
                          /[^\da-z]/gi,
                          '',
                        )}family: aggregations(filters: $sqon${i}family) {
                          participants__family__family_members__kf_id {
                            buckets {
                              doc_count
                            }
                          }
                        }
                      `,
                      )
                      .join('\n')}
                  }
                }
              `}
              variables={dataTypes.reduce((acc, dataType, i) => {
                const dataTypeFilters = ids => [
                  {
                    op: 'in',
                    content: { field: 'data_type', value: [dataType.key] },
                  },
                  {
                    op: 'in',
                    content: { field: 'participants.kf_id', value: ids },
                  },
                ];

                return {
                  ...acc,
                  [`sqon${i}family`]: { op: 'and', content: dataTypeFilters(familyMemberIds) },
                  [`sqon${i}`]: { op: 'and', content: dataTypeFilters(finalFamilyMemberIds) },
                };
              }, {})}
              render={({ data, loading }) => {
                return loading
                  ? spinner
                  : (dataTypes || []).map(bucket => {
                      const aggs = get(data, `file`);
                      return (
                        <DataTypeOption
                          disabled={isDisabled}
                          key={bucket.key}
                          bucket={bucket}
                          values={values}
                          familyMembers={get(
                            aggs,
                            `${bucket.key.replace(
                              /[^\da-z]/gi,
                              '',
                            )}family.participants__family__family_members__kf_id.buckets.length`,
                          )}
                          fileSize={get(
                            aggs,
                            `${bucket.key.replace(/[^\da-z]/gi, '')}.file_size.stats.sum`,
                          )}
                        />
                      );
                    });
              }}
            />
          )}
          <DownloadManifestModalFooter
            {...{
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
};

export default enhance(FamilyManifestModal);
