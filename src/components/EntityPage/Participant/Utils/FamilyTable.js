import * as React from 'react';
import { get, flatMap } from 'lodash';
import { Link } from 'react-router-dom';
import sanitize from './sanitize';
import ParticipantDataTable from './ParticipantDataTable';

/*
Needs to be a class: we're using setState to display the table after the calls to graphql are done to populate the rows
 */
class FamilyTable extends React.Component {
  constructor(props) {
    super(props);

    const participant = props.participant;
    participant.relationship = "(this participant)";

    const compNode = get(participant, 'family.family_compositions.hits.edges[0].node');
    this.composition = compNode.composition;

    const famMembersNodes = [participant].concat(get(compNode, 'family_members.hits.edges', []).map(ele => ele.node))

    this.heads = this.buildHeads(famMembersNodes);
    this.rows = this.buildRows(famMembersNodes);
  }

  buildHeads(famMembersNodes) {
    function makeCell(wrapper) {
      if (wrapper.row._original.subheader === 'true') {
        if (wrapper.column.Header === '')
          return <div style={{ fontWeight: 'bold', color: '#404c9a' }}>{wrapper.value}</div>;
      } else return <div style={{ textTransform: 'capitalize' }}>{wrapper.value}</div>;

      return '';
    }

    return [{ Header: '', accessor: 'leftfield', Cell: makeCell }].concat(famMembersNodes.map(node => {
      const kf_id = node.kf_id;

      return {
        Header:
          (famMembersNodes[0].kf_id === kf_id  //if it's the current participant
            ? (
                <div style={{ textAlign: 'center' }} >
                  <div>{kf_id}</div>
                  <div style={{ textTransform: 'capitalize' }}>{node.relationship}</div>
                </div>
              )
            : (
                <Link style={{ textAlign: 'center' }} to={'/participant/' + kf_id + '#summary'}>
                  <div>{kf_id}</div>
                  <div style={{ textTransform: 'capitalize' }}>{node.relationship}</div>
                </Link>
              )
          ),
        accessor: kf_id,
        Cell: makeCell,
      }
    }))
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
  ParticipantDataTable.
  */
  buildRows(famMembersNodes) {

    /**
     * Makes a baseline row.
     *
     * @param leftfield Its left field
     * @param accessor Its accessor
     * @param subheader Is it a subheader?
     * @param subaccessor Subaccessor for array items
     * @returns {{leftfield: *, subheader: boolean}}
     */
    const allIDs = famMembersNodes.map(m => m.kf_id);
    function baseline(leftfield, accessor = '', subheader = false, subaccessor = '') {
      const temp = {
        leftfield: leftfield,
        subheader: subheader,
        acc: accessor,
        subacc: subaccessor,
      };

      allIDs.forEach(id => (temp[id] = '--'));

      return temp;
    }

    const rows = [
      baseline('Generic Information', '', true),
      baseline('Proband', 'is_proband'),
      baseline('Vital Status', 'outcome.vital_status'),
      baseline('Gender', 'gender'),
      baseline('Diagnoses (Mondo)', 'diagnoses.hits.edges', true, 'mondo_id_diagnosis'),
      baseline('Diagnoses (NCIT)', 'diagnoses.hits.edges', true, 'ncit_id_diagnosis'),
    ];

    return famMembersNodes.reduce( (rows, node) => {  //reduce the family members into rows of a table
      const kf_id = node.kf_id;

      return flatMap(rows, currentRow => {  //map the rows into more rows, splicing in new rows as needed with flatMap's unpacking
        const accessorItem = get(node, currentRow.acc, null);   //the item at the accessor

        if(currentRow.acc === "") return currentRow; //if the accessor of the row is empty, nothing to do
        else if(Array.isArray(accessorItem)) { //if the item is an array, then we'll have to extract some subaccessors from the array items

          //we return an array when we want to splice our values at this index: since we're using flatMap, it'll unpack them in the right positions for us!
          //if the value we want to splice in is an empty array, no biggie, it will be unpacked into, well, nothing
          return  [currentRow].concat(accessorItem.map(a => get(a.node, currentRow.subacc, null)).reduce( (acc, name) => {   //reduce the accessed array into new rows
            let subRow = rows.find( (ele) => ele.leftfield === name); //let's try to see if the value is already in there.

            if(subRow) subRow[kf_id] = "reported";  //if it is, great, let's just mutate it.
            else {
              subRow = baseline(name);  //if it's not, we have to make a new row,
              subRow[kf_id] = "reported"; //add the reported value
              acc.push(subRow); //push that new row to the accumulator
            }

            return acc; //in any case, we have to return the acc.
          }, []));

        } else {  //if the item is not an array, we can just plug its value into the current row
          currentRow[kf_id] = accessorItem;
          return currentRow;
        }
      });
    }, rows);
  }

  render() {
    const composition = this.composition;

    if (composition === 'proband-only') return (
      <div>
        <span style={{ textTransform: 'capitalize' }}>{composition}</span>; no recorded family
      </div>
    );

    else return (
      <ParticipantDataTable columns={this.heads} data={sanitize(this.rows)} />
    );
  }
}

export default FamilyTable;
