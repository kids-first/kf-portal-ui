import * as React from 'react';
import { get } from 'lodash';
import { EntityContentDivider, EntityContentSection } from '../';
import FamilyTable from './Utils/FamilyTable';
import sanitize from './Utils/sanitize';
import familySVG from '../../../assets/icon-families-grey.svg';
import ParticipantDataTable from './Utils/ParticipantDataTable';
import participantQuery from '../../../services/arranger/participantEntityQuery';
import graphql, { buildSqonForIds, getErrorMessageFromResponse } from 'services/arranger';
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
import { store } from "../../../store";

//https://kf-qa.netlify.com/participant/PT_C954K04Y#summary tons of phenotypes
//https://kf-qa.netlify.com/participant/PT_CB55W43A#clinical family has mother and child being affected

class ParticipantClinical extends React.Component {
  constructor(props) {
    super(props);

    this.state = {ready: false};

    this.buildData();
  }

  buildData() {
    const api = initializeApi({
      onError: console.err,
      onUnauthorized: response => {
        console.warn('Unauthorized', response);
      },
    });

    function call(diagnosis) {
      return graphql(api)({
        query: `query($sqon: JSON) {participant {hits(filters: $sqon) {total}}}`,
        variables: `{"sqon":{"op":"and","content":[{"op":"in","content":{"field":"diagnoses.mondo_id_diagnosis","value":["${diagnosis}"]}}]}}` ,
      })
    }

    this.diagnoses = get(this.props.participant, 'diagnoses.hits.edges', []).map(ele => get(ele, 'node', {}));

    Promise.all(
      (() => {
        const temp = this.diagnoses.map( diag => {  //start ajax calls to know the shared with.
          return call(diag.mondo_id_diagnosis);
        });

        this.diagnoses = this.diagnoses.map( diag => {  //make age more readable
          const age = diag.age_at_event_days;

          const years = (""+(age / 365)).split(".")[0];
          const days = age - (years * 365);

          diag.age_at_event_days = age === null ? "--" : (years > 0) ? `${years} years and ${days} days` : `${age} days`;

          return diag;
        });

        return temp;
      })()

    ).then( nums => {

      for(let i=0; i<nums.length; i++) this.diagnoses[i].shared_with = get(nums[i], "data.participant.hits.total", "--");

      this.diagnoses = sanitize(this.diagnoses);

      this.setState({ready: true});
    });
  }

  render() {

    if(this.state.ready === false) return <div>Loading...</div>;

    const diagHeads = [
      { Header: 'Diagnosis Category', accessor: 'diagnosis_category' },
      { Header: 'Diagnosis (Mondo)', accessor: 'mondo_id_diagnosis' },
      { Header: 'Diagnosis (NCIT)', accessor: 'ncit_id_diagnosis' },
      { Header: 'Diagnosis (Source Text)', accessor: 'source_text_diagnosis' },
      { Header: 'Age at event', accessor: 'age_at_event_days' },
      { Header: 'Shared with', accessor: 'shared_with', Cell: ((wrapper) => {

        console.log("wrapper "); console.log(wrapper)

        const onClick = () => {
          store.dispatch(resetVirtualStudy());

          const newSqon = {
            op: 'in',
            content: {
              field: "diagnoses.mondo_id_diagnosis",
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

          console.log("SETTING SQONSSSSSS !");
          console.log(store.dispatch(setSqons(modifiedSqons)));

          this.props.history.push('/explore');
        };

        return <div onClick={onClick}>{wrapper.value}</div>
      })
      },
    ];

    const participant = this.props.participant;
    const diagnoses = this.diagnoses;
    //const phenotypes = getNodes(participant, "phenotype", []);

    return (
      <React.Fragment>
        <EntityContentSection title="Diagnoses">
          {diagnoses.length === 0 ? (
            <div>No diagnoses.</div>
          ) : (
            <ParticipantDataTable
              columns={diagHeads}
              data={diagnoses}
            />
          )}
        </EntityContentSection>
        {participant.family_id && (
          <div>
            <EntityContentDivider />
            <EntityContentSection title={'Family'}>
              <div style={{ color: '#404c9a', fontWeight: 'bold' }}>
                <img
                  src={familySVG}
                  style={{ height: '1em', marginRight: '1em' }}
                  alt={'family icon'}
                />
                {participant.family_id}
              </div>
              <FamilyTable participant={participant} />
            </EntityContentSection>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default withRouter(ParticipantClinical);