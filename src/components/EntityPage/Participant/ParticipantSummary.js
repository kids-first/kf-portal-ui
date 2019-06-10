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


const enhance = compose(withTheme);

/**
 * Accesses obj.Hits.Edges.atI.Node
 * @param obj
 * @param i
 * @returns {*}
 */
function hein(obj, i=0) {
  return obj.hits.edges[i].node
}

/**
 * Sanitizes an array. Makes boolean values into their corresponding Strings. Transforms null into "Null value".
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

function summaryTableData(participant) {
  return sannitize([
    { title: 'Kids First/Participant ID:', summary: participant.kf_id },

    { title: 'External ID:', summary: participant.external_id },
    {
      title: 'Study:',
      summary: (
        <ExternalLink
          href={`${kfWebRoot}/support/studies-and-access`}
          onClick={e => {
            trackUserInteraction({
              category: TRACKING_EVENTS.categories.entityPage.file,
              action: TRACKING_EVENTS.actions.click + `: File Property: Study`,
              label: `${participant.study.short_name} (${participant.study.kf_id})`,
            });
          }}
        >
          {`${participant.study.short_name} (${participant.study.kf_id})`}
        </ExternalLink>
      )
    },
    { title: 'Diagnosis category:', summary: hein(participant.diagnoses).diagnosis_category },
    { title: 'Proband:', summary: participant.is_proband },
    { title: 'Family Composition:', summary: hein(participant.family.family_compositions).composition },
    { title: 'Gender:', summary: participant.gender },
    { title: 'Ethnicity:', summary: participant.ethnicity },
    { title: 'Race:', summary: participant.race },
    { title: 'Vital Status:', summary: participant.outcome.vital_status },
    { title: 'Disease Related:', summary: participant.outcome.disease_related }
  ]);
}

function specimenTableData() {
  return [
    {
      Header: "TESTTTTTTTTTTTTTTTTT",
      accessor: 'selected',
      filterable: false,
      sortable: false,
      skipExport: true,
      resizable: false,
      minWidth: 33,
    },
    { Header: 'Participant ID', accessor: 'participantId' },
    {
      Header: 'Study Name',
      accessor: 'studyName',
      minWidth: 140,
    },
    { Header: 'Proband', accessor: 'isProband', minWidth: 65 },
    { Header: 'Vital Status', accessor: 'vitalStatus', minWidth: 70 },
    {
      Header: 'Diagnosis Category',
      accessor: 'diagnosisCategories',
      field: 'diagnoses.diagnosis_category',
      sortable: false,
    },
    {
      Header: 'Diagnosis (Mondo)',
      accessor: 'diagnosisMondo',
      field: 'diagnoses.mondo_id_diagnosis',
      minWidth: 175,
      sortable: false,
    },
    {
      Header: 'Age at Diagnosis (days)',
      accessor: 'ageAtDiagnosis',
      field: 'diagnoses.age_at_event_days',
      sortable: false,
    },
    { Header: 'Gender', accessor: 'gender', field: 'gender', minWidth: 70 },
    { Header: 'Family ID', accessor: 'familyId', field: 'family_id' },
    {
      Header: 'Family Composition',
      accessor: 'familyCompositions',
      field: 'family.family_compositions',
      sortable: false,
    },
    {
      Header: 'Files',
      accessor: 'filesCount',
      field: 'files',
      sortable: false,
    },
  ];
}

function temp() {
}

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
          <div label="bla1">Bla1</div>
          <div label="bla2">Bla2</div>
          <div label="bla3">Bla3</div>
        </Holder>
      </EntityContentSection>
      <EntityContentDivider />
      <EntityContentSection title="Available Data">
      </EntityContentSection>
    </React.Fragment>
  );
};

export default enhance(ParticipantSummary);
