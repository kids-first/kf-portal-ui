import * as React from 'react';
import { get } from 'lodash';
import { EntityContentDivider, EntityContentSection } from '../';
import FamilyTable from './Utils/FamilyTable';
import sanitize from './Utils/sanitize';
import ParticipantDataTable from './Utils/ParticipantDataTable';
import graphql from 'services/arranger';
import { initializeApi } from '../../../services/api';
import { Link } from 'react-router-dom';
import { setSqons } from 'store/actionCreators/virtualStudies';
import {
  getDefaultSqon,
  MERGE_OPERATOR_STRATEGIES,
  MERGE_VALUES_STRATEGIES,
  setSqonValueAtIndex,
} from '../../../common/sqonUtils';
import { withRouter } from 'react-router';
import { resetVirtualStudy } from '../../../store/actionCreators/virtualStudies';
import { store } from '../../../store';
import prettifyAge from './Utils/prettifyAge';
import { flatMap } from 'lodash/collection';
import { HPOLink, SNOMEDLink , MONDOLink, NCITLink} from '../../Utils/DiagnosisAndPhenotypeLinks';

//https://kf-qa.netlify.com/participant/PT_C954K04Y#summary tons of phenotypes
//https://kf-qa.netlify.com/participant/PT_CB55W43A#clinical family has mother and child being affected

class ParticipantClinical extends React.Component {
  constructor(props) {
    super(props);

    this.state = { diagnoses: false, phenotypes: false };

    this.dataIntoState();

    this.updateState = (state, callback) => this.setState({...this.state, ...state}, callback);
  }

  diagnosisIntoState(api) {
    function call(diagnosis) {
      return graphql(api)({
        query: `query($sqon: JSON) {participant {hits(filters: $sqon) {total}}}`,
        variables: `{"sqon":{"op":"and","content":[{"op":"in","content":{"field":"diagnoses.mondo_id_diagnosis","value":["${diagnosis}"]}}]}}`,
      });
    }

    let diagnoses = get(this.props.participant, 'diagnoses.hits.edges', []).map(ele =>
      Object.assign({}, get(ele, 'node', {})) //copy obj
    );

    Promise.all(
      (() => {
        const temp = diagnoses.map(diag => {
          //start ajax calls to know the shared with.
          return call(diag.mondo_id_diagnosis);
        });

        diagnoses = diagnoses.map(diag => {
          //make age more readable while we wait for the calls

          diag.age_at_event_days = prettifyAge(diag.age_at_event_days);

          return diag;
        });

        return temp;
      })(),
    ).then(nums => {
      for (let i = 0; i < nums.length; i++) {
        diagnoses[i].shared_with = this.prettySharedWith(get(nums[i], 'data.participant.hits.total', '--'));
      }

      this.updateState({ diagnoses: sanitize(diagnoses) });  //once we're ready, just tell the state, it'll do the rest
    });
  }

  phenotypeIntoState(api) { //stub for when the phenotypes are available
    function callObs(phenotype) {
      return graphql(api)({
        query: `query($sqon: JSON) {participant {hits(filters: $sqon) {total}}}`,
        variables: `{"sqon":{"op":"and","content":[{"op":"in","content":{"field":"phenotype.hpo_phenotype_observed","value":["${phenotype}"]}}]}}`,
      });
    }

    function callNotObs(phenotype) {
      return graphql(api)({
        query: `query($sqon: JSON) {participant {hits(filters: $sqon) {total}}}`,
        variables: `{"sqon":{"op":"and","content":[{"op":"in","content":{"field":"phenotype.hpo_phenotype_not_observed","value":["${phenotype}"]}}]}}`,
      });
    }

    let phenotypes = get(this.props.participant, 'phenotype.hits.edges', []).map(ele =>
      Object.assign({}, get(ele, 'node', {})) //copy obj
    );

    phenotypes = flatMap( phenotypes.sort( (a, b) => a.age_at_event_days-b.age_at_event_days ), pheno => {
      //transform phenotypes while we wait for the calls

      if(pheno.observed) {
        pheno.interpretation = "Observed";
        pheno.hpo = pheno.hpo_phenotype_observed;
        pheno.snomed = pheno.snomed_phenotype_observed;
      } else {
        pheno.interpretation = "Not Observed";
        pheno.hpo = pheno.hpo_phenotype_not_observed;
        pheno.snomed = pheno.snomed_phenotype_not_observed;
      }

      pheno.age_at_event_days = prettifyAge(pheno.age_at_event_days);

      return [pheno];
    });

    Promise.all(
      phenotypes.map(pheno => {
        //start ajax calls to know the shared with.
        return pheno.interpretation === "Observed" ? callObs(pheno.hpo) : callNotObs(pheno.hpo);
      })
    ).then(nums => {
      for (let i = 0; i < nums.length; i++) {
        phenotypes[i].shared_with = this.prettySharedWith(get(nums[i], 'data.participant.hits.total', '--'));
      }

      this.updateState({ phenotypes: sanitize(phenotypes) });  //once we're ready, just tell the state, it'll do the rest
    });
  }

  dataIntoState() {
    const api = initializeApi({
      onError: console.err,
      onUnauthorized: response => {
        console.warn('Unauthorized', response);
      },
    });

    this.diagnosisIntoState(api);
    this.phenotypeIntoState(api);
  }

  prettySharedWith(amount) {
    if(amount === "--") return amount;
    else if(amount === 1) return `${amount} participant`;
    else return `${amount} participants`;
  }

   showParticipantNb = (wrapper , field , value) =>{
          if(wrapper.value === "0 participants") return <div>0 participants</div>;

          const onClick = () => {
            store.dispatch(resetVirtualStudy());

            const newSqon = {
              op: 'in',
              content: {
                field: field,
                value: value,
              },
            };

            const modifiedSqons = setSqonValueAtIndex(
              getDefaultSqon(), //virtualStudy.sqons,
              0, //virtualStudy.activeIndex,
              newSqon,
              {
                operator: MERGE_OPERATOR_STRATEGIES.KEEP_OPERATOR,
                values: MERGE_VALUES_STRATEGIES.APPEND_VALUES,
              },
            );

            store.dispatch(setSqons(modifiedSqons))
          };

          return <Link to={"/explore"} onClick={onClick}>{wrapper.value}</Link>;
    }



  render() {
    const cellBreak = wrapper => <div style={{wordBreak: "break-word", textTransform: "capitalize"}}>{wrapper.value}</div>;

    const diagHeads = [
      { Header: 'Diagnosis Category', accessor: 'diagnosis_category', Cell: cellBreak },
      { Header: 'Diagnosis (Mondo)', accessor: 'mondo_id_diagnosis', Cell: (wrapper) => wrapper.value === "--" ? <div>--</div> : <MONDOLink mondo={wrapper.value}/> },
      { Header: 'Diagnosis (NCIT)', accessor: 'ncit_id_diagnosis',  Cell: (wrapper) => wrapper.value === "--" ? <div>--</div> : <NCITLink ncit={wrapper.value}/> },
      { Header: 'Diagnosis (Source Text)', accessor: 'source_text_diagnosis', Cell: cellBreak },
      { Header: 'Age at event', accessor: 'age_at_event_days', Cell: cellBreak },
      {
        Header: 'Mondo term shared with',
        accessor: 'shared_with',
        Cell: wrapper => {

        const  participant = this.showParticipantNb(wrapper , 'diagnoses.mondo_id_diagnosis' , [wrapper.original.mondo_id_diagnosis])

        return participant

        },
      },
    ];

    const phenoHeads = [
      { Header: 'Phenotype (HPO)', accessor: 'hpo', Cell: (wrapper) => wrapper.value === "--" ? <div>--</div> : <HPOLink hpo={wrapper.value}/> },
      { Header: "Phenotype (SNOMED)", accessor: 'snomed', Cell: (wrapper) => wrapper.value === "--" ? <div>--</div> : <SNOMEDLink snomed={wrapper.value}/> },
      { Header: 'Phenotype (Source Text)', accessor: 'source_text_phenotype', Cell: cellBreak },
      { Header: 'Interpretation', accessor: 'interpretation', Cell: cellBreak },
      { Header: 'Age at event', accessor: 'age_at_event_days', Cell: cellBreak },
      {
        Header: 'HPO term shared with',
        accessor: 'shared_with',
        Cell: wrapper => {

          const  participant = this.showParticipantNb(wrapper , wrapper.original.interpretation === 'Observed' ? "phenotype.hpo_phenotype_observed" : "phenotype.hpo_phenotype_not_observed" , [wrapper.original.hpo])

          return participant
        },
      },
    ];

    const participant = this.props.participant;
    const diagnoses = this.state.diagnoses;
    const phenotypes = this.state.phenotypes;

    return (
      <React.Fragment>
        {
          !diagnoses
            ? ""
            : diagnoses.length === 0
              ? ""
              : (
                <EntityContentSection title="Diagnoses">
                  <ParticipantDataTable columns={diagHeads} data={diagnoses} />
                </EntityContentSection>
              )
        }
        {
          !phenotypes
            ? ""
            : phenotypes.length === 0
              ? ""
              : (
                <EntityContentSection title="Phenotypes">
                  <ParticipantDataTable columns={phenoHeads} data={phenotypes} />
                </EntityContentSection>
              )
        }
        {participant.family_id && (
          <div>
            {diagnoses.length === 0 ? "" : <EntityContentDivider /> }
            <EntityContentSection title={`Family Members (${participant.family_id})`}>
              <FamilyTable participant={participant} />
            </EntityContentSection>
          </div>
        )}
      </React.Fragment>
    );
  }
}
//: {get(participant, "family.family_composition.hits.edges[0].node.composition", "trio")}
export default withRouter(ParticipantClinical);
