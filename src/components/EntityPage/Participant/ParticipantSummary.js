import * as React from 'react';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';

import Row from 'uikit/Row';
import Column from 'uikit/Column';

import VariableSummaryTable from 'uikit/SummaryTable/VariableSummaryTable'
import { EntityContentSection, EntityContentDivider } from '../';

import ExternalLink from 'uikit/ExternalLink';

import { SecondaryNavMenu, SecondaryNavContent } from 'uikit/SecondaryNav';

import { kfWebRoot } from 'common/injectGlobals';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import ControlledDataTable from "../../../uikit/DataTable/ControlledDataTable";
import {SORTABLE_FIELDS_MAPPING} from "../../CohortBuilder/ParticipantsTableView/queries";

import { configureCols } from 'uikit/DataTable/utils/columns';
import Holder from "./Holder";
import styled from "react-emotion";
import {Div} from "../../../uikit/Core";
import SequencingDataTable from "./Utils/SequencingDataTable";
import OtherDataTypesSummaryTable from "./Utils/OtherDataTypesSummaryTable";
import { Link } from 'react-router-dom';

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
function sannitize(arr) {
  return arr.map( ele => {
    let sannitized = ele.summary;
    if (ele.summary === null) sannitized = "--";
    else if(typeof ele.summary === "boolean") sannitized = `${sannitized}`;

    return {title: ele.title, summary: sannitized}
  })
}

/**
 * Sometimes, intermediate nested fields are missing.
 *
 * Trying to access participant.diagnoses.hits.edges[0].node.diagnosis_category, for example, crashes the page when
 * node is missing. https://kf-qa.netlify.com/participant/PT_3FV3E420#summary
 *
 * Thus, we're wrapping every access in a try catch that simply returns null when the accessor fails.
 *
 * We're taking the opportunity to sannitize the return value:
 *  null = --
 *  boolean = true/false
 *
 * @param obj
 * @param accessor
 * @returns {string|*|null|undefined}
 */
function getter(obj, accessor) {
  try {
    let current = obj;
    for(let fields = accessor.split('.'); fields.length > 0; fields.shift()) {
      current = current[fields[0]];
    }

    return current;
  } catch (ignored) {
    return null;
  }
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
  function get(accessor) {
    return getter(participant, accessor)
  }

  return sannitize([
    { title: 'Kids First/Participant ID:', summary: get("kf_id") },

    { title: 'External ID:', summary: get("external_id") },
    {
      title: 'Study:',
      summary: (
        <ExternalLink
          href={`${kfWebRoot}/support/studies-and-access`}
          onClick={e => {
            trackUserInteraction({
              category: TRACKING_EVENTS.categories.entityPage.file,
              action: TRACKING_EVENTS.actions.click + `: File Property: Study`,
              label: `${participant.study.short_name} (${get("study.kf_id")})`,
            });
          }}
        >
          {`${participant.study.short_name} (${get("study.kf_id")})`}
        </ExternalLink>
      )
    },
    { title: 'Diagnosis category:', summary: get("diagnoses.hits.edges.0.node.diagnosis_category") },
    { title: 'Proband:', summary: get("is_proband") },
    { title: 'Family Composition:', summary: get("participant.family.family_compositions.hits.edges.0.node.composition") },
    { title: 'Gender:', summary: get("gender") },
    { title: 'Ethnicity:', summary: get("ethnicity") },
    { title: 'Race:', summary: get("race") },
    { title: 'Vital Status:', summary: get("outcome.vital_status") },
    { title: 'Disease Related:', summary: get("outcome.disease_related") }
  ]);
}

/**
 * Builds the data for the SummaryTable of the given specimen
 *
 * @param specimen
 * @returns {*}
 */
function specimenSummaryTableData(specimen) {

  /**
   * Syntaxic sugar for getter
   *
   * @param accessor
   * @returns {string|*}
   */
  function get(accessor) {
    return getter(specimen, accessor)
  }

  return sannitize( [
    { title: "Specimen ID", summary: get("kf_id")},
    { title: "Age at Sample Acquisition", summary: get("age_at_event_days")},
    { title: "Analyte Type", summary: get("analyte_type")},
    { title: "Composition", summary: get("composition")},
    { title: "Tissue Type (NCIT)", summary: get("ncit_id_tissue_type")},
    { title: "Anatomical Site (Uberon)", summary: get("uberon_id_anatomical_site")},
    { title: "Tissue Type (Source Text)", summary: get("source_text_tissue_type")},
    { title: "Tumor Description (Source Text)", summary: get("source_text_tumor_descriptor")},
    { title: "Consent Code (dbGaP)", summary: get("consent_type")}
  ])
}

const SubContent = styled(Div)`
  margin-left: 1em;
`;

const ParticipantSummary = ({participant}) => {
  window.console.log(participant)

  return (
    <React.Fragment>
      <EntityContentSection title="Summary">
        <VariableSummaryTable rows={summaryTableData(participant)} nbOfTables={2} />
      </EntityContentSection>
      <EntityContentDivider />
      <EntityContentSection title="Biospecimens">
        <Holder>
          {
            participant.biospecimens.hits.edges.map( specimenNode => {
              const specimen = specimenNode.node;

              return <VariableSummaryTable label={specimen.kf_id} rows={specimenSummaryTableData(specimen)} nbOfTables={2}/>
            })
          }
        </Holder>
      </EntityContentSection>
      <EntityContentDivider />
      <EntityContentSection title="Available Data">
        <SubContent>
          <EntityContentSection title="Sequencing Data">
            <SequencingDataTable files={participant.files.hits.edges} participantID={participant.kf_id}/>
          </EntityContentSection>
          <EntityContentDivider />
          <EntityContentSection title="Other Data Types">
            <OtherDataTypesSummaryTable files={participant.files.hits.edges} participantID={participant.kf_id}/>
          </EntityContentSection>
        </SubContent>
      </EntityContentSection>
    </React.Fragment>
  );
//
};

export default enhance(ParticipantSummary);
