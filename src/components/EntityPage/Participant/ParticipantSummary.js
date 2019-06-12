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
import SequencingDataTable from "./SequencingDataTable";


const enhance = compose(withTheme);

function he(obj) {
  return obj.hits.edges;
}

/**
 * Accesses obj.Hits.Edges.atI.Node
 * @param obj
 * @param i
 * @returns {*}
 */
function hein(obj, i=0) {
  return he(obj)[i].node;
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
  window.console.log(participant)

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

/**
 * Defines columns. Need to pass a data obj to the table with the same accessors as these columns
 * @returns {*[]}
 */
function sequencingDataColumns() {
  return [
    { Header: "WGS", accessor: "source.unalignedReads", sortable: true },
    { Header: "Unaligned Reads", accessor: "source.unalignedReads", sortable: true },
    { Header: 'Aligned Reads', accessor: "source.alignedReads", sortable: true },
    { Header: 'gVCF', accessor: 'source.gVCF', sortable: true },
    { Header: 'Variant', accessor: 'source.variant', minWidth: 65 },
    { Header: "Unaligned Reads", accessor: "harmonized.unalignedReads", sortable: true },
    { Header: 'Aligned Reads', accessor: "harmonized.alignedReads", sortable: true },
    { Header: 'gVCF', accessor: 'harmonized.gVCF', sortable: true },
    { Header: 'Variant', accessor: 'harmonized.variant', minWidth: 65 },
  ];
}

function makeSpecimentTable(specimen) {
  let columns = configureCols(
    sequencingDataColumns(),
  ).map(field =>
    field.sortable !== false && SORTABLE_FIELDS_MAPPING.has(field.accessor)
      ? { ...field, sortable: true }
      : { ...field, sortable: false },
  )

   return <ControlledDataTable label={specimen.kf_id} columns={columns} data={[specimen]} dataTotalCount={columns.length} loading={false} onFetchData={() => null}>{specimen.kf_id}</ControlledDataTable>
};

function specimenSummaryTableData(specimen) {
  return sannitize( [
    { title: "Specimen ID", summary: specimen.kf_id},
    { title: "Age at Sample Acquisition", summary: specimen.age_at_event_days},
    { title: "Analyte Type", summary: specimen.analyte_type},
    { title: "Composition", summary: specimen.composition},
    { title: "Tissue Type (NCIT)", summary: specimen.ncit_id_tissue_type},
    { title: "Anatomical Site (Uberon)", summary: specimen.uberon_id_anatomical_site},
    { title: "Tissue Type (Source Text)", summary: specimen.source_text_tissue_type},
    { title: "Tumor Description (Source Text)", summary: specimen.source_text_tumor_descriptor},
    { title: "Consent Code (dbGaP)", summary: specimen.consent_type},
    { title: "Files", summary: "TODO"}
  ])
}

function otherDataTypesSummaryTableData(files) {

  let wrongTypes = new Set(["Aligned Reads", "gVCF", "Unaligned Reads", "Variant Calls"]);

  let arr = [];

  function makeRow(title) {
    arr.push( {title: title, summary: 1} )
  }

  files.forEach( fileTemp => {
    const file = fileTemp.node;
    const type = file.data_type;

    if(!wrongTypes.has(type)) {
      let row = arr.find(ele => (ele.title === type));

      if(typeof row === 'undefined') {
        makeRow(type)
      } else {
        row.summary = row.summary + 1
      }
    }
  });

  return (arr.length === 0 ? <div>No other data types</div> : <VariableSummaryTable rows={arr} nbOfTables={2}/>)
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
            he(participant.biospecimens).map( specimenNode => {
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
            <SequencingDataTable files={he(participant.files)}/>
          </EntityContentSection>
          <EntityContentDivider />
          <EntityContentSection title="Other Data Types">
            {otherDataTypesSummaryTableData(he(participant.files))}
          </EntityContentSection>
        </SubContent>
      </EntityContentSection>
    </React.Fragment>
  );

};

export default enhance(ParticipantSummary);
