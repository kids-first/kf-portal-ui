import * as React from 'react';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { fetchParticipantWithId } from '../../../../services/arranger/participants';
import { initializeApi } from '../../../../services/api';

import sanitize from './sanitize';
import ParticipantDataTable from './ParticipantDataTable';

/*
Needs to be a class: we're using setState to display the table after the calls to graphql are done to populate the rows
 */
class FamilyTable extends React.Component {
  constructor(props) {
    super(props);

    const participant = props.participant;
    participant.relationsip = "this participant";

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
          (() => {
            if(famMembersNodes[0].kf_id === kf_id) {  //if it's the current participant
              return (
                <div style={{ textAlign: 'center' }} >
                  <div>{kf_id}</div>
                  <div style={{ textTransform: 'capitalize' }}>{node.relationship}</div>
                  <div>(This participant)</div>
                </div>
              )
            } else {  //otherwise
              return (
                <Link style={{ textAlign: 'center' }} to={'/participant/' + kf_id + '#summary'}>
                  <div>{kf_id}</div>
                  <div style={{ textTransform: 'capitalize' }}>{node.relationship}</div>
                </Link>
              )
            }

          })(),
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

    const allIDs = famMembersNodes.map(m => m.kf_id);

    /**
     * Makes a baseline row.
     *
     * @param leftfield Its left field
     * @param accessor Its accessor
     * @param subheader Is it a subheader?
     * @param subaccessor Subaccessor for array items
     * @returns {{leftfield: *, subheader: boolean}}
     */
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

    return famMembersNodes.reduce( (rowAccumulator, node) => {  //reduce the family members into rows of a table
      const kf_id = node.kf_id;

      return rowAccumulator.reduce( (rowIterator, currentRow, i) => { //reduce the rows got
        if(currentRow.acc === "") return rowIterator; //if the accessor of the row is empty, nothing to do

        const accessorItem = get(node, currentRow.acc, null);   //the item at the accessor

        if(Array.isArray(accessorItem)) { //if the item is an array, then we'll have to extract some subaccessors from the array items

          const subRowsToAdd = accessorItem.map(a => get(a.node, currentRow.subacc, null)).reduce( (acc, item) => {
            const subRow = rowIterator.find( (ele) => ele.leftField === item);

            if(subRow) {
              subRow[kf_id] = "reported";
              return acc;
            } else {
              const subRow = baseline(item);
              subRow[kf_id] = "reported";
              acc.push(subRow);
              return acc;
            }
          }, []);

          rowIterator.splice(i+1+rowIterator.length-rowAccumulator.length, 0, ...subRowsToAdd);
          return rowIterator;
        } else {
          currentRow[kf_id] = accessorItem;

          return rowIterator
        }
      }, [...rowAccumulator]);
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
