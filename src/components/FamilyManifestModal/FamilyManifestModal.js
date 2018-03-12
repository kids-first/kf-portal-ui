import React from 'react';
import { get } from 'lodash';
import { compose, withProps } from 'recompose';
import { withFormik } from 'formik';
import { injectState } from 'freactal/lib/inject';
import Spinner from 'react-spinkit';

import { withQuery } from '@arranger/components';

import { FamilyManifestStats } from '../Stats';
import { ModalFooter } from '../Modal';
import { fileManifestParticipantsAndFamily } from '../../services/downloadData';
import DataTypeOption from './DataTypeOption';
import Query from '@arranger/components/dist/Query';

const enhance = compose(
  injectState,
  withQuery(({ sqon, projectId }) => ({
    projectId,
    key: 'dataTypesAggregation',
    query: `
      query dataTypes($sqon: JSON) {
        file {
          aggregations(filters: $sqon) {
            participants__family__family_data__available_data_types {
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
  withQuery(({ sqon, projectId }) => ({
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
  withProps(({ dataTypesAggregation, familyMemberIdAggregation }) => {
    return {
      dataTypes:
        get(
          dataTypesAggregation,
          'file.aggregations.participants__family__family_data__available_data_types.buckets',
        ) || [],
      familyMemberIds: (
        get(
          familyMemberIdAggregation,
          'file.aggregations.participants__family__family_members__kf_id.buckets',
        ) || []
      ).map(b => b.key),
    };
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
      const selectedDataTypes = Object.entries(values)
        .filter(([, val]) => val)
        .map(([key]) => key);

      fileManifestParticipantsAndFamily({
        sqon: {
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
        },
        columns: columns,
      })().then(async profile => unsetModal(), errors => setSubmitting(false));
    },
  }),
);

const FamilyManifestModal = ({
  dataTypesAggregation,
  familyMemberIds,
  familyMemberIdAggregation,
  dataTypes,
  sqon,
  index,
  projectId,
  values,
  submitForm,
  isSubmitting,
}) => {
  const loading = !dataTypesAggregation || !familyMemberIdAggregation;
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
    <div>
      <div
        css={`
          margin-bottom: 9px;
          font-size: 15px;
          font-weight: 600;
          line-height: 1.87;
          letter-spacing: 0.2px;
          color: #343434;
        `}
      >
        File Summary:
      </div>
      <FamilyManifestStats
        sqon={sqon}
        index={index}
        projectId={projectId}
        css={`
          margin-bottom: 29px;
        `}
      />
      <div
        css={`
          margin-bottom: 16px;

          font-size: 15px;
          font-weight: 600;
          line-height: 1.87;
          letter-spacing: 0.2px;
          color: #343434;
        `}
      >
        Select the data types you would like to download for the family members:
      </div>
      {loading ? (
        spinner
      ) : (
        <Query
          projectId={projectId}
          query={`
            query dataTypes(${dataTypes.map((dataType, i) => `$sqon${i}: JSON`).join(', ')}) {
              file {
                ${dataTypes
                  .map(
                    (dataType, i) => `
                    ${dataType.key.replace(/[^\da-z]/gi, '')}: aggregations(filters: $sqon${i}) {
                      file_size {
                        stats {
                          sum
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
            return {
              ...acc,
              [`sqon${i}`]: {
                op: 'and',
                content: [
                  {
                    op: 'in',
                    content: { field: 'data_type', value: [dataType.key] },
                  },
                  {
                    op: 'in',
                    content: { field: 'participants.kf_id', value: familyMemberIds },
                  },
                ],
              },
            };
          }, {})}
          render={familyFileSizeStats => {
            return !familyFileSizeStats
              ? spinner
              : (dataTypes || []).map(bucket => (
                  <DataTypeOption
                    key={bucket.key}
                    bucket={bucket}
                    values={values}
                    fileSize={get(
                      familyFileSizeStats,
                      `file.${bucket.key.replace(/[^\da-z]/gi, '')}.file_size.stats.sum`,
                    )}
                  />
                ));
          }}
        />
      )}
      <ModalFooter
        submitText={
          <div>
            {isSubmitting ? (
              <Spinner
                fadeIn="none"
                name="circle"
                color="#fff"
                style={{
                  width: 15,
                  height: 15,
                }}
              />
            ) : (
              'DOWNLOAD MANIFEST'
            )}
          </div>
        }
        handleSubmit={isSubmitting ? undefined : submitForm}
      />
    </div>
  );
};

export default enhance(FamilyManifestModal);
