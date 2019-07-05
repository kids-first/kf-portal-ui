import { Link } from 'react-router-dom';
import * as React from 'react';
import VariableSummaryTable from 'uikit/SummaryTable/VariableSummaryTable';
import { EntityContentSection } from '../../index';

const OtherDataTypesSummaryTable = ({ files, participantID }) => {
  //"Other" being "not sequencing data"...
  let wrongTypes = new Set(['Aligned Reads', 'gVCF', 'Unaligned Reads', 'Variant Calls']);

  let arr = [];

  files.forEach(fileTemp => {
    //for every file
    const file = fileTemp.node;
    const type = file.data_type;

    if (!wrongTypes.has(type)) {
      //if they're the right type
      let row = arr.find(ele => ele.title === type); //find its row to increment the number of files

      if (typeof row === 'undefined') {
        //if we can't find the row
        arr.push({ title: type, summary: 1 }); //make a new one
      } else {
        row.summary++; //or increment the number of the existing row
      }
    }
  });

  //now that we have the numbers, transform them into Links
  arr = arr.map(row => {
    const url = `/search/file?sqon=
        {  
           "op":"and",
           "content":[  
              {  
                 "op":"in",
                 "content":{  
                    "field":"data_type",
                    "value":[  
                       "${row.title}"
                    ]
                 }
              },
              {  
                 "op":"in",
                 "content":{  
                    "field":"participants.kf_id",
                    "value":[  
                       "${participantID}"
                    ]
                 }
              }
           ]
        }
      `;

    return { ...row, summary: <Link to={url}>{row.summary}</Link> };
  });

  //we're setting the width of the SummaryTable's parent to be wayyy too small. This makes it the minimum viable width.
  return arr.length === 0 ? (
    ''
  ) : (
    <EntityContentSection title="Other Data Types" size={'small'}>
      <div style={{width: 0}}>
        <VariableSummaryTable rows={arr} nbOfTables={1} />
      </div>
    </EntityContentSection>
  );
};

export default OtherDataTypesSummaryTable;
