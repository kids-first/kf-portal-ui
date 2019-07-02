import * as React from 'react';
import { get } from 'lodash';
import { EntityContentDivider, EntityContentSection } from '../';
import FamilyTable from './Utils/FamilyTable';
import sanitize from './Utils/sanitize';
import familySVG from '../../../assets/icon-families-grey.svg';
import ParticipantDataTable from './Utils/ParticipantDataTable';

//https://kf-qa.netlify.com/participant/PT_C954K04Y#summary tons of phenotypes
//https://kf-qa.netlify.com/participant/PT_CB55W43A#clinical family has mother and child being affected

const ParticipantClinical = ({ participant }) => {
  const diagHeads = [
    { Header: 'Diagnosis Category', accessor: 'diagnosis_category' },
    { Header: 'Diagnosis (Mondo)', accessor: 'mondo_id_diagnosis' },
    { Header: 'Diagnosis (NCIT)', accessor: 'ncit_id_diagnosis' },
    { Header: 'Diagnosis (Source Text)', accessor: 'source_text_diagnosis' },
    { Header: 'Age at event', accessor: 'age_at_event_days' },
    { Header: 'Shared with', accessor: 'harmonized.alignedreads' },
  ];

  const diagnoses = get(participant, 'diagnoses.hits.edges', []).map(ele =>
    sanitize(get(ele, 'node', {})),
  );
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
};

export default ParticipantClinical;
