import * as React from 'react';
import { get } from 'lodash';
// eslint-disable-next-line
import { EntityContentDivider, EntityContentSection } from '../';
// eslint-disable-next-line
import FamilyTable from './Utils/FamilyTable';
import sanitize from './Utils/sanitize';
// eslint-disable-next-line
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

//https://kf-qa.netlify.com/participant/PT_C954K04Y#summary tons of phenotypes
//https://kf-qa.netlify.com/participant/PT_CB55W43A#clinical family has mother and child being affected

class ParticipantClinical extends React.Component {
  constructor(props) {
    super(props);

    this.state = { diagnoses: false };

    this.dataIntoState();
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
          const age = diag.age_at_event_days;

          const years = Number(('' + age / 365).split('.')[0]);
          const days = age - years * 365;

          function format() {
            function y() {
              if(years === 1) return `${years} year `;
              else if(years === 0) return "";
              else return `${years} years `;
            }

            function d() {
              if(days === 1) return `${days} day`;
              else if(days === 0) return "";
              else return `${days} days`;
            }

            if(age === null) return "--";
            else return y() + d();
          }

          diag.age_at_event_days = format();

          return diag;
        });

        return temp;
      })(),
    ).then(nums => {
      for (let i = 0; i < nums.length; i++)
        diagnoses[i].shared_with = get(nums[i], 'data.participant.hits.total', '--');

      this.setState({ diagnoses: sanitize(diagnoses) });  //once we're ready, just tell the state, it'll do the rest
    });
  }

  getPhenotypeData(api) { //stub for when the phenotypes are available

  }

  dataIntoState() {
    // eslint-disable-next-line
    const api = initializeApi({
      onError: console.err,
      onUnauthorized: response => {
        console.warn('Unauthorized', response);
      },
    });

    this.diagnosisIntoState(api)
  }

  render() {
    const cellBreak = wrapper => <div style={{wordBreak: "break-word", textTransform: "capitalize"}}>{wrapper.value}</div>;

// eslint-disable-next-line
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
// eslint-disable-next-line
    const participant = this.props.participant;
    const diagnoses = this.state.diagnoses;
    //const phenotypes = getNodes(participant, "phenotype", []);

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
        <div>More coming soon!</div>
      </React.Fragment>
      /*
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
      </React.Fragment>*/
    );
  }
}
//: {get(participant, "family.family_composition.hits.edges[0].node.composition", "trio")}
export default withRouter(ParticipantClinical);
