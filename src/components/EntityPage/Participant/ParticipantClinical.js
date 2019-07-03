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

//https://kf-qa.netlify.com/participant/PT_C954K04Y#summary tons of phenotypes
//https://kf-qa.netlify.com/participant/PT_CB55W43A#clinical family has mother and child being affected

export default class ParticipantClinical extends React.Component {
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
      this.diagnoses.map( diag => {
        return call(diag.mondo_id_diagnosis);
      })
    ).then( nums => {

      for(let i=0; i<nums.length; i++) {
        this.diagnoses[i].shared_with = get(nums[i], "data.participant.hits.total", "--");
      }

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
      { Header: 'Age at event (days)', accessor: 'age_at_event_days' },
      { Header: 'Shared with', accessor: 'shared_with' },
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