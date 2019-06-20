import * as React from 'react';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { fetchParticipantWithId } from '../../../../services/arranger/participants';
import { initializeApi } from '../../../../services/api';
import ControlledDataTable from '../../../../uikit/DataTable/ControlledDataTable';

import sanitize from './sanitize';

/*
Needs to be a class: we're using setState to display the table after the calls to graphql are done to populate the rows
 */
class FamilyTable extends React.Component  {

  constructor(props) {
    super(props);

    this.state = {ready: false};

    const participant = props.participant;

    const compNode = get(participant, "family.family_compositions.hits.edges[0].node");
    this.composition = compNode.composition;
    this.famMembersNodes = get(compNode, "family_members.hits.edges", []).map(ele => ele.node);

    this.buildDataAndRows(participant);
  }

  /*
  Logically part of the constructor, but does a very precise task: build the rows and headers for the table.

  This is essentially a SQL pivot in JS. We're simplifying the logic by a TON by using a "baseline-accessor-subaccessor"
  logic.

  What we're doing is creating the rows with basic values. We're specifying the name of those rows, and how they access
  their corresponding data in the member.

  If the accessed data isn't an array: cool! We're done, just add the value of
  that data to the colomn of that.

  If the accessed data is an array: we have a problem. We just want values, not arrays of values. So we'll start by
  accessing the right element in that array by using the row's subaccessor. Then, we'll look in our rows to see if
  there's one that has the same row name as that subaccessor. (Example: we're asking for the mondo diagnosis. This is a
  field in the array accessed by diagnoses. => member.diagnoses returns an array => access mondo diagnosis => look for a
  row called mondo diagnosis.) If we can't find said row, we're creating a new one and inserting it right after the row
  that created that search (here, diagnoses).

  After all that, the rows are directly ready to use in one pass, and we're directly putting them in our
  ControlledDataTable.
  */
  buildDataAndRows(participant) {

    function makeCell(wrapper) {
      if(wrapper.row._original.subheader === "true") {
        if(wrapper.column.Header === "") return <div style={{fontWeight: "bold", color: "#404c9a"}}>{wrapper.value}</div>;

      } else return <div style={{textTransform: "capitalize"}}>{wrapper.value}</div>

      return "";
    }

    this.heads = [{ Header: "", accessor: "leftfield", Cell: makeCell}];
    const allIDs = [];

    Promise.all(
      this.famMembersNodes.map( node => {
        const kf_id = node.kf_id;

        // headers needs to be done here as we need relationship
        this.heads.push(
          {
            Header:
              <Link style={{textAlign: "center"}} to={"/participant/"+kf_id+"#summary"} >
                {(kf_id === participant.kf_id ?
                  <img src={require("../../../../assets/icon-participants.svg")} style={{height: "1em", marginRight: "1em", float: "left"}} alt={"participant icon"}/> :
                  ""
                )}
                <div>{kf_id}</div>
                <div style={{textTransform: "capitalize"}}>{node.relationship}</div>
              </Link>,
            accessor: kf_id,
            Cell: makeCell
          }
        );

        allIDs.push(kf_id);

        if(kf_id !== participant.kf_id) {
          return fetchParticipantWithId(
            initializeApi({ onError: console.err, onUnauthorized: response => {console.warn('Unauthorized', response);}, })
            , kf_id
          );

        } else return Promise.resolve(participant); //dont make another call if we have the same participant
      })

    ).then(members => {

      /**
       * Makes a baseline row.
       *
       * @param leftfield Its left field
       * @param accessor Its accessor
       * @param subheader Is it a subheader?
       * @param subaccessor Subaccessor for array items
       * @returns {{leftfield: *, subheader: boolean}}
       */
      function baseline(leftfield, accessor = "", subheader = false, subaccessor = "") {
        const temp = { leftfield: leftfield, subheader: subheader, acc: accessor, subacc: subaccessor };

        allIDs.forEach(id => temp[id] = "--");

        return temp;
      }

      /*
      Defines the data that we want in the table.
       */
      this.rows = [
        baseline("Generic Information", "", true),
        baseline("Proband", "is_proband"),
        baseline("Vital Status", "outcome.vital_status"),
        baseline("Ethnicity", "ethnicity"),
        baseline("Race", "race"),
        baseline("Gender", "gender"),
        baseline("Diagnoses", "diagnoses.hits.edges", true, "diagnosis"),
        baseline("Diagnoses (Mondo)", "diagnoses.hits.edges", true, "mondo_id_diagnosis"),
        baseline("Diagnoses (NCIT)", "diagnoses.hits.edges", true, "ncit_id_diagnosis"),
        baseline("Diagnoses (Source Text)", "diagnoses.hits.edges", true, "source_text_diagnosis")
      ];

      members.forEach( node => {
        const kf_id = node.kf_id;

        for(let i=0; i<this.rows.length; i++) {
          const las = this.rows[i];

          if(las.acc === "") continue;  //if the accessor of the row is empty, nothing to do

          const item = get(node, las.acc, null);  //the item at the accessor

          if(Array.isArray(item)) { //if the accessed thing is an Array, we're actually possibly adding a LAS

            item.forEach( tempEle => {  //so for every ele in the array
              const ele = tempEle.node;

              const subItem = get(ele, las.subacc, null); //grab the subaccessor

              //then, try to find the row corresponding to that subaccessor
              let subLas = null;
              for(let j=i; j<this.rows.length; j++) {
                if (this.rows[j].leftfield === subItem) {
                  subLas = this.rows[j];
                  break
                }
              }

              if(subLas === null) {         //if we couldn't find it
                subLas = baseline(subItem); //create a new row

                //this.rows.splice(i, 0, subLas)  //causes infinite loop/OOM error?

                //and insert it right after the current accessor's row
                const startArr = this.rows.slice(0, i+1);
                startArr.push(subLas);

                const endArr = this.rows.slice(i+1, this.rows.length);

                this.rows = startArr.concat(endArr)
              }

              subLas[kf_id] = true; //in any case, we now have the subrow, and we can change its value
            })

          } else {              //if the accessed thing is not an Array, we're directly adding it to the LAS
            las[kf_id] = item;
          }
        }
      });

      this.setState( {ready: true} )
    })
  }

  render() {
    const composition = this.composition;
    const famMembersNodes = this.famMembersNodes;

    if(composition === "proband-only" || famMembersNodes.length <= 1) return <div><span style={{textTransform: "capitalize"}} >{composition}</span>; no recorded family</div>;

    if(!this.state.ready) return <div>Building your table...</div>;

    return (
      <div>
        <div style={{textTransform: "capitalize"}} >Type: {composition}</div>
        <ControlledDataTable loading={false} columns={this.heads} data={sanitize(this.rows)} dataTotalCount={-1} onFetchData={() => null} />
      </div>
    )
  }
}

export default FamilyTable;