import React, { Fragment } from 'react';
import get from 'lodash/get';

import VariableSummaryTable from 'uikit/SummaryTable/VariableSummaryTable';
import { EntityContentDivider, EntityContentSection } from '../';
import ExternalLink from 'uikit/ExternalLink';
import { kfWebRoot } from 'common/injectGlobals';
import { TRACKING_EVENTS, trackUserInteraction } from 'services/analyticsTracking';
import Holder from './Utils/Holder';
import SequencingDataTable from './Utils/SequencingDataTable';
import OtherDataTypesSummaryTable from './Utils/OtherDataTypesSummaryTable';
import sanitize from './Utils/sanitize';
import { NCITLink } from '../../Utils/DiagnosisAndPhenotypeLinks';
import HistologicalDiagnosisTable from '../Histological/histologicalDiagnosisTable.js';
import prettifyAge from './Utils/prettifyAge';
import BiospecimenIcon from 'icons/BiospecimenIcon';
import Tooltip from 'uikit/Tooltip';
import theme from 'theme/defaultTheme';
import { STUDIES_WITH_PEDCBIO, DB_GA_P, generateUrlForDbGap } from 'common/constants';
import PropTypes from 'prop-types';

/**
 * Sometimes, intermediate nested fields are missing.
 *
 * Trying to access participant.diagnoses.hits.edges[0].node.diagnosis_category, for example, crashes the page when
 * node is missing. https://kf-qa.netlify.com/participant/PT_3FV3E420#summary
 *
 * Syntaxic sugar for _.get with null as default
 *
 * @param obj
 * @param accessor
 */
const getter = (obj, accessor) => get(obj, accessor, null);

const summaryTableData = (participant) => {
  const getIt = (accessor) => getter(participant, accessor);

  const participantId = getIt('kf_id');
  const studyId = getIt('study.kf_id');

  let rows = [
    { title: 'Kids First/Participant ID', summary: participantId },

    { title: 'Participant - External ID', summary: getIt('external_id') },
    {
      title: 'Study',
      summary: (
        <ExternalLink
          href={`${kfWebRoot}/support/studies-and-access`}
          onClick={async () => {
            await trackUserInteraction({
              category: TRACKING_EVENTS.categories.entityPage.file,
              action: `${TRACKING_EVENTS.actions.click}: File Property: Study`,
              label: `${participant.study.short_name} (${studyId})`,
            });
          }}
          style={{ whiteSpace: 'auto' }}
        >
          {`${getIt('study.short_name')} (${studyId})`}
        </ExternalLink>
      ),
    },
  ];

  const studyDbGaP = getIt('study.data_access_authority');
  if (DB_GA_P === studyDbGaP) {
    const studyExternalId = getIt('study.external_id');
    rows = [
      ...rows,
      {
        title: 'dbGaP Accession Number',
        summary: (
          <ExternalLink
            href={generateUrlForDbGap(studyExternalId)}
            onClick={async () => {
              await trackUserInteraction({
                category: TRACKING_EVENTS.categories.entityPage.file,
                action: `${TRACKING_EVENTS.actions.click}: DbGaP link`,
                label: `${participant.study.data_access_authority} (${studyDbGaP})`,
              });
            }}
          >
            {studyExternalId}
          </ExternalLink>
        ),
      },
    ];
  }

  if (STUDIES_WITH_PEDCBIO.includes(studyId)) {
    rows = [
      ...rows,
      {
        title: 'PedcBioPortal',
        summary: (
          <ExternalLink
            href={`https://pedcbioportal.kidsfirstdrc.org/patient?studyId=pbta_all&caseId=${participantId}`}
            onClick={async () => {
              await trackUserInteraction({
                category: TRACKING_EVENTS.categories.entityPage.file,
                action: `${TRACKING_EVENTS.actions.click}: File Property: Study`,
                label: `${participant.study.short_name} (${studyId})`,
              });
            }}
          >
            {participantId}
          </ExternalLink>
        ),
      },
    ];
  }
  rows = [
    ...rows,
    {
      title: 'Diagnosis category',
      summary: getIt('diagnoses.hits.edges.0.node.diagnosis_category'),
    },
    { title: 'Proband', summary: participant.is_proband },
    {
      title: 'Family ID',
      summary: getIt('family_id'),
    },
    {
      title: 'Family Composition',
      summary: getIt('family.family_compositions.hits.edges[0].node.composition'),
    },
    { title: 'Gender', summary: participant.gender },
    { title: 'Ethnicity', summary: participant.ethnicity },
    { title: 'Race', summary: participant.race },
    { title: 'Vital Status', summary: getIt('outcome.vital_status') },
    { title: 'Disease Related', summary: getIt('outcome.disease_related') },
  ];
  return sanitize(rows);
};

const specimenSummaryTableData = (specimen) =>
  sanitize([
    { title: 'Specimen ID', summary: specimen.kf_id },
    { title: 'Age at Sample Acquisition', summary: prettifyAge(specimen.age_at_event_days) },
    { title: 'Analyte Type', summary: specimen.analyte_type },
    { title: 'Composition', summary: specimen.composition },
    { title: 'Tissue Type (NCIT)', summary: <NCITLink ncit={specimen.ncit_id_tissue_type} /> },
    { title: 'Anatomical Site (Uberon)', summary: specimen.uberon_id_anatomical_site },
    { title: 'Tissue Type (Source Text)', summary: specimen.source_text_tissue_type },
    { title: 'Tumor Description (Source Text)', summary: specimen.source_text_tumor_descriptor },
    { title: 'Consent Code (dbGaP)', summary: specimen.consent_type },
  ]);

const getSanitizedSpecimenDxsData = (specimen) =>
  get(specimen, 'diagnoses.hits.edges', [])
    .filter((edge) => edge && Object.keys(edge).length > 0)
    .map((edge) =>
      sanitize({
        ...edge.node,
        age_at_event_days: prettifyAge(get(edge.node, 'age_at_event_days')),
      }),
    );

const biospecimenIdToTargetProps = (specimens = []) =>
  specimens.reduce((acc, specimen) => {
    const currentNode = specimen.node;
    if (!currentNode.kf_id) {
      return acc;
    }

    const hasRelatedBioSpecimenDx = get(currentNode, 'diagnoses.hits.edges', []).length > 0;
    return {
      ...acc,
      [currentNode.kf_id]: {
        rightIcon: hasRelatedBioSpecimenDx ? (
          <Tooltip html={'Histological Diagnosis'}>
            <BiospecimenIcon width="25px" height="15px" fill={theme.biospecimenOrange} />
          </Tooltip>
        ) : null,
      },
    };
  }, {});

const ParticipantSummary = ({ participant }) => {
  const specimens = get(participant, 'biospecimens.hits.edges', []);
  const hasFile = get(participant, 'files.hits.edges', []).length > 0;

  const hasSequencingData = get(participant, 'files.hits.edges', []).some((edge) =>
    ['Aligned Reads', 'gVCF', 'Unaligned Reads', 'Variant Calls'].includes(edge?.node?.data_type),
  );

  return (
    <>
      <EntityContentSection title="Summary">
        <VariableSummaryTable rows={summaryTableData(participant)} nbOfTables={2} />
      </EntityContentSection>
      {specimens.length > 0 && (
        <div>
          <EntityContentDivider />
          <EntityContentSection title="Biospecimens">
            <Holder biospecimenIdToData={biospecimenIdToTargetProps(specimens)}>
              {specimens.map((specimenNode) => {
                const specimen = specimenNode.node;
                const specimenDxsData = getSanitizedSpecimenDxsData(specimen);
                return (
                  <Fragment key={specimen.kf_id}>
                    <VariableSummaryTable
                      key={specimen.kf_id}
                      label={specimen.kf_id}
                      rows={specimenSummaryTableData(specimen)}
                      nbOfTables={2}
                    />
                    {specimenDxsData.length > 0 && (
                      <EntityContentSection
                        key={`entityContentSection`}
                        title="Histological Diagnoses"
                        size={'small'}
                      >
                        {specimenDxsData.map((sanitizedNode, index) => (
                          <HistologicalDiagnosisTable
                            key={`histological_dx_table_specimen_id_${specimen.kf_id}_node_index_${index}`}
                            data={[sanitizedNode]}
                          />
                        ))}
                      </EntityContentSection>
                    )}
                  </Fragment>
                );
              })}
            </Holder>
          </EntityContentSection>
        </div>
      )}

      {hasFile && (
        <div>
          <EntityContentDivider />
          <EntityContentSection title="Available Data Files" size={'big'}>
            {hasSequencingData && (
              <EntityContentSection title="Sequencing Data" size={'small'}>
                <SequencingDataTable
                  files={get(participant, 'files.hits.edges', [])}
                  participantID={participant.kf_id}
                />
              </EntityContentSection>
            )}
            <OtherDataTypesSummaryTable
              files={get(participant, 'files.hits.edges', [])}
              participantID={participant.kf_id}
              hasSequencingData={hasSequencingData}
            />
          </EntityContentSection>
        </div>
      )}
    </>
  );
};

ParticipantSummary.propTypes = {
  participant: PropTypes.object,
};

export default ParticipantSummary;
