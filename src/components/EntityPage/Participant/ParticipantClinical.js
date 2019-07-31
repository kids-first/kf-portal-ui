import * as React from 'react';
import { get } from 'lodash';
import { EntityContentDivider, EntityContentSection } from '../';
import FamilyTable from './Utils/FamilyTable';
import sanitize from './Utils/sanitize';
import familySVG from '../../../assets/icon-families-grey.svg';
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
      for (let i = 0; i < nums.length; i++)
        diagnoses[i].shared_with = get(nums[i], 'data.participant.hits.total', '--');

      this.updateState({ diagnoses: sanitize(diagnoses) });  //once we're ready, just tell the state, it'll do the rest
    });
  }

  phenotypeIntoState(api) { //stub for when the phenotypes are available
    function call(phenotype) {
      return graphql(api)({
        query: `query($sqon: JSON) {participant {hits(filters: $sqon) {total}}}`,
        variables: `{"sqon":{"op":"and","content":[{"op":"in","content":{"field":"phenotypes.hpo_phenotype_observed","value":["${phenotype}"]}}]}}`,
      });
    }

    let phenotypes = flatMap(get(this.props.participant, 'phenotype.hits.edges', []).map(ele =>
      Object.assign({}, get(ele, 'node', {})) //copy obj
    ), pheno => (pheno.hpo_phenotype_not_observed === null && pheno.hpo_phenotype_observed === null) ? [] : pheno); //TODO do we really want to filter out non-hpo phenos? Ask vincent

    Promise.all(
      (() => {
        const temp = phenotypes.map(pheno => {
          //start ajax calls to know the shared with.
          return call(pheno.hpo_phenotype_observed);
        });

        phenotypes = flatMap( phenotypes, pheno => {
          //transform phenotypes while we wait for the calls

          if(pheno.hpo_phenotype_not_observed === null) {
            pheno.hpo = pheno.hpo_phenotype_observed;
            pheno.interpretation = "Observed";
          } else {
            pheno.hpo = pheno.hpo_phenotype_not_observed;
            pheno.interpretation = "Not Observed";
          }

          pheno.age_at_event_days = prettifyAge(pheno.age_at_event_days);

          return [pheno];
        });

        return temp;
      })(),
    ).then(nums => {
      for (let i = 0; i < nums.length; i++)
        phenotypes[i].shared_with = get(nums[i], 'data.participant.hits.total', '--');

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

  render() {
    const cellBreak = wrapper => <div style={{wordBreak: "break-word", textTransform: "capitalize"}}>{wrapper.value}</div>;

    console.log(this.state.phenotypes)

    const diagHeads = [
      { Header: 'Diagnosis Category', accessor: 'diagnosis_category', Cell: cellBreak },
      { Header: 'Diagnosis (Mondo)', accessor: 'mondo_id_diagnosis', Cell: cellBreak },
      { Header: 'Diagnosis (NCIT)', accessor: 'ncit_id_diagnosis', Cell: cellBreak },
      { Header: 'Diagnosis (Source Text)', accessor: 'source_text_diagnosis', Cell: cellBreak },
      { Header: 'Age at event', accessor: 'age_at_event_days', Cell: cellBreak },
      {
        Header: 'Shared with',
        accessor: 'shared_with',
        Cell: wrapper => {

          const onClick = () => {
            store.dispatch(resetVirtualStudy());

            const newSqon = {
              op: 'in',
              content: {
                field: 'diagnoses.mondo_id_diagnosis',
                value: [wrapper.original.mondo_id_diagnosis],
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
        },
      },
    ];

    const phenoHeadsObs = [
      { Header: 'Phenotype (HPO)', accessor: 'hpo', Cell: cellBreak },
      { Header: 'Phenotype (Source Text)', accessor: 'source_text_phenotype', Cell: cellBreak },
      { Header: 'Interpretation', accessor: 'interpretation', Cell: cellBreak },
      { Header: 'Age at event', accessor: 'age_at_event_days', Cell: cellBreak },
      {
        Header: 'Shared with',
        accessor: 'shared_with',
        Cell: wrapper => {

          const onClick = () => {
            store.dispatch(resetVirtualStudy());

            const newSqon = {
              op: 'in',
              content: {
                field: 'diagnoses.mondo_id_diagnosis',
                value: [wrapper.original.mondo_id_diagnosis],
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
        },
      },
    ];

    console.log(this.props.participant)

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
                  <ParticipantDataTable columns={phenoHeadsObs} data={phenotypes} />
                </EntityContentSection>
              )
        }

        {participant.family_id && (
          <div>
            {diagnoses.length === 0 ? "" : <EntityContentDivider /> }
            <EntityContentSection title={'Shared Diagnosis Within Family Members'}>
              <div>
                <img
                  src={familySVG}
                  style={{ height: '1em', marginRight: '1em' }}
                  alt={'family icon'}
                />
                Family ID: <span style={{ color: '#404c9a', fontWeight: 'bold' }}>{participant.family_id}</span>
              </div>
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
