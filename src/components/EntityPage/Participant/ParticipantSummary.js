import * as React from 'react';
import {compose} from 'recompose';
import {withTheme} from 'emotion-theming';
import VariableSummaryTable from 'uikit/SummaryTable/VariableSummaryTable'
import {EntityContentDivider, EntityContentSection} from '../';
import ExternalLink from 'uikit/ExternalLink';
import {kfWebRoot} from 'common/injectGlobals';
import {TRACKING_EVENTS, trackUserInteraction} from 'services/analyticsTracking';
import Holder from "./Utils/Holder";
import styled from "react-emotion";
import {Div} from "../../../uikit/Core";
import SequencingDataTable from "./Utils/SequencingDataTable";
import OtherDataTypesSummaryTable from "./Utils/OtherDataTypesSummaryTable";
import {get} from 'lodash';

//https://kf-qa.netlify.com/participant/PT_CMB6TASJ#summary

const enhance = compose(withTheme);

/**
 * Sanitizes an array of SummaryTable data.
 *
 * Makes boolean values into their corresponding Strings. Transforms null into "Null value".
 *
 * @param arr The array
 * @returns {*} The sannitized array
 */
function sanitizeSummaryData(arr) {
  return arr.map( ele => {
    let sanitized = ele.summary;
    if (ele.summary === null) sanitized = "--";
    else if(typeof ele.summary === "boolean") sanitized = `${sanitized}`;

    return {title: ele.title, summary: sanitized}
  })
}

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
function getter(obj, accessor) {
  return get(obj, accessor, null);
}

/**
 * Builds the data for the main SummaryTable.
 *
 * @param participant
 * @returns {*}
 */
function summaryTableData(participant) {

  /**
   * Syntaxic sugar for getter
   *
   * @param accessor
   * @returns {string|*}
   */
  function getIt(accessor) {
    return getter(participant, accessor)
  }

  return sanitizeSummaryData([
    { title: 'Kids First/Participant ID:', summary: getIt("kf_id") },

    { title: 'External ID:', summary: getIt("external_id") },
    {
      title: 'Study:',
      summary: (
        <ExternalLink
          href={`${kfWebRoot}/support/studies-and-access`}
          onClick={e => {
            trackUserInteraction({
              category: TRACKING_EVENTS.categories.entityPage.file,
              action: TRACKING_EVENTS.actions.click + `: File Property: Study`,
              label: `${participant.study.short_name} (${getIt("study.kf_id")})`,
            });
          }}
        >
          {`${getIt("study.short_name")} (${getIt("study.kf_id")})`}
        </ExternalLink>
      )
    },
    { title: 'Diagnosis category:', summary: getIt("diagnoses.hits.edges.0.node.diagnosis_category") },
    { title: 'Proband:', summary: participant.is_proband },
    { title: 'Family Composition:', summary: getIt("participant.family.family_compositions.hits.edges.0.node.composition") },
    { title: 'Gender:', summary: participant.gender },
    { title: 'Ethnicity:', summary: participant.ethnicity },
    { title: 'Race:', summary: participant.race },
    { title: 'Vital Status:', summary: getIt("outcome.vital_status") },
    { title: 'Disease Related:', summary: getIt("outcome.disease_related") }
  ]);
}

/**
 * Builds the data for the SummaryTable of the given specimen
 *
 * @param specimen
 * @returns {*}
 */
function specimenSummaryTableData(specimen) {

  return sanitizeSummaryData( [
    { title: "Specimen ID", summary: specimen.kf_id },
    { title: "Age at Sample Acquisition", summary: specimen.age_at_event_days },
    { title: "Analyte Type", summary: specimen.analyte_type },
    { title: "Composition", summary: specimen.composition},
    { title: "Tissue Type (NCIT)", summary: specimen.ncit_id_tissue_type},
    { title: "Anatomical Site (Uberon)", summary: specimen.uberon_id_anatomical_site},
    { title: "Tissue Type (Source Text)", summary: specimen.source_text_tissue_type},
    { title: "Tumor Description (Source Text)", summary: specimen.source_text_tumor_descriptor},
    { title: "Consent Code (dbGaP)", summary: specimen.consent_type}
  ])
}

const SubContent = styled(Div)`
  margin-left: 1em;
`;

const ParticipantSummary = ({participant}) => {
  return (
    <React.Fragment>
      <EntityContentSection title="Summary">
        <VariableSummaryTable rows={summaryTableData(participant)} nbOfTables={2} />
      </EntityContentSection>
      <EntityContentDivider />
      <EntityContentSection title="Biospecimens">
        <Holder>
          {
            get(participant, "biospecimens.hits.edges", []).map( specimenNode => {
              const specimen = specimenNode.node;

              return <VariableSummaryTable key={specimen.kf_id} label={specimen.kf_id} rows={specimenSummaryTableData(specimen)} nbOfTables={2}/>
            })
          }
        </Holder>
      </EntityContentSection>
      <EntityContentDivider />
      <EntityContentSection title="Available Data">
        <SubContent>
          <EntityContentSection title="Sequencing Data">
            <SequencingDataTable files={get(participant, "files.hits.edges", [])} participantID={participant.kf_id}/>
          </EntityContentSection>
          <EntityContentDivider />
          <EntityContentSection title="Other Data Types">
            <OtherDataTypesSummaryTable files={get(participant, "files.hits.edges", [])} participantID={participant.kf_id}/>
          </EntityContentSection>
        </SubContent>
      </EntityContentSection>
    </React.Fragment>
  );
};

export default enhance(ParticipantSummary);
