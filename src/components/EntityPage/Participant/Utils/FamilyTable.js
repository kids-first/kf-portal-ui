import * as React from 'react';
import get from 'lodash/get';
import flatMap from 'lodash/flatMap';
import { Link } from 'react-router-dom';
import sanitize from './sanitize';
import ParticipantDataTable from './ParticipantDataTable';
import {
  HPOLink,
  SNOMEDLink,
  MONDOLink,
  NCITLink,
} from '../../../Utils/DiagnosisAndPhenotypeLinks';
import EntityContentSection from '../../EntityContentSection';

const DXS_PHENOTYPES_HEADER_LABELS = [
  'Diagnoses (Mondo)',
  'Diagnoses (NCIT)',
  'Phenotypes (HPO)',
  'Phenotypes (SNOMED)',
];

const hasTableSharingDxOrPhenotypes = (finalRows = []) => {
  return finalRows.some(r => r && DXS_PHENOTYPES_HEADER_LABELS.includes(r.leftfield));
};

const isParticipantSharingDxOrPheno = (row, restOfFamilyIds) => {
  return restOfFamilyIds.some(memId => Boolean(row[memId]) && row[memId] !== '--');
};

const getParticipantId = (nodes = []) => {
  const participant = nodes.find(e => e && e.relationship === '(this participant)');
  // must always exists
  return participant.kf_id;
};

const buildDefaultForMembers = (ids = [], defaultValue = '--') => {
  return ids.reduce((acc, id) => {
    return {
      ...acc,
      [id]: defaultValue,
    };
  }, {});
};

const baselineWithIds = ids => (leftfield, accessor = '', subheader = false, subaccessor = '') => {
  return {
    leftfield: leftfield,
    subheader: subheader,
    acc: accessor,
    subacc: subaccessor,
    ...buildDefaultForMembers(ids),
  };
};

const buildPhenotypesRows = (famMemNodes = {}, ids) => {
  const phHPO = {};
  const phSNO = {};
  famMemNodes.forEach(member => {
    get(member, 'phenotype.hits.edges', []).forEach(ele => {
      ele = ele.node;
      const report = ele.observed ? 'Observed' : 'Not observed';
      ['hpo', 'snomed'].forEach(partialKey => {
        const term = ele.observed
          ? ele[`${partialKey}_phenotype_observed`]
          : ele[`${partialKey}_phenotype_not_observed`];
        const toFill = partialKey === 'hpo' ? phHPO : phSNO;
        if (term) {
          if (!(term in toFill)) {
            const parentHeaderId =
              partialKey === 'hpo' ? 'Phenotypes (HPO)' : 'Phenotypes (SNOMED)';
            toFill[term] = { ...baselineWithIds(ids)(term), parentHeaderId };
          }
          toFill[term][member.kf_id] = report;
        }
      });
    });
  });
  return {
    phHPO,
    phSNO,
  };
};

const makeCell = wrapper => {
  if (wrapper.row._original.subheader === 'true') {
    if (wrapper.column.Header === '')
      return <div style={{ fontWeight: 'bold', color: '#404c9a' }}>{wrapper.value}</div>;
  } else {
    const value = wrapper.value;

    if (/^.*SNOMEDCT:\d+$/.test(value)) return <SNOMEDLink snomed={value} />;
    else if (/^.*\(HP:\d+\)$/.test(value)) return <HPOLink hpo={value} />;
    else if (/^.*\(MONDO:\d+\)$/.test(value)) return <MONDOLink mondo={value} />;
    else if (/^.*\(NCIT:.\d+\)$/.test(value)) return <NCITLink ncit={value} />;
    else return <div style={{ textTransform: 'capitalize' }}>{value}</div>;
  }

  return '';
};

class FamilyTable extends React.Component {
  buildHeads(famMembersNodes) {
    return [{ Header: '', accessor: 'leftfield', Cell: makeCell }].concat(
      famMembersNodes.map(node => {
        const kf_id = node.kf_id;

        return {
          Header:
            famMembersNodes[0].kf_id === kf_id ? (
              <div style={{ textAlign: 'center' }}>
                <div>{kf_id}</div>
                <div style={{ textTransform: 'capitalize' }}>{node.relationship}</div>
              </div>
            ) : (
              <Link style={{ textAlign: 'center' }} to={'/participant/' + kf_id + '#summary'}>
                <div>{kf_id}</div>
                <div style={{ textTransform: 'capitalize' }}>{node.relationship}</div>
              </Link>
            ),
          accessor: kf_id,
          Cell: makeCell,
        };
      }),
    );
  }

  buildRows(famMembersNodes) {
    const allIDs = famMembersNodes.map(m => m.kf_id);
    const baseline = baselineWithIds(allIDs);
    let rows = [
      baseline('Generic Information', '', true),
      baseline('Proband', 'is_proband'),
      baseline('Vital Status', 'outcome.vital_status'),
      baseline('Gender', 'gender'),
      {
        ...baseline('Diagnoses (Mondo)', 'diagnoses.hits.edges', true, 'mondo_id_diagnosis'),
        headerId: 'Diagnoses (Mondo)',
      },
      {
        ...baseline('Diagnoses (NCIT)', 'diagnoses.hits.edges', true, 'ncit_id_diagnosis'),
        headerId: 'Diagnoses (NCIT)',
      },
    ];

    rows = famMembersNodes.reduce((accRows, node) => {
      const kf_id = node.kf_id;
      return flatMap(accRows, currentRow => {
        if (currentRow.acc === '') return currentRow;
        const accessorItem = get(node, currentRow.acc, null);
        if (Array.isArray(accessorItem)) {
          return [currentRow].concat(
            accessorItem
              .map(a => get(a.node, currentRow.subacc, null))
              .reduce((acc, name) => {
                //reduce the accessed array into new rows
                let subRow = accRows.find(ele => ele.leftfield === name);
                if (!subRow) {
                  if (['Diagnoses (Mondo)', 'Diagnoses (NCIT)'].includes(currentRow.headerId)) {
                    subRow = {
                      ...baseline(name),
                      parentHeaderId: currentRow.headerId,
                    };
                  } else {
                    subRow = baseline(name);
                  }

                  subRow[kf_id] = 'reported';
                  acc.push(subRow);
                }
                return acc;
              }, []),
          );
        } else {
          currentRow[kf_id] = accessorItem;
          return currentRow;
        }
      });
    }, rows);

    const { phHPO, phSNO } = buildPhenotypesRows(famMembersNodes, allIDs);

    rows = rows
      .concat([{ ...baseline('Phenotypes (HPO)', '', true), headerId: 'Phenotypes (HPO)' }])
      .concat(Object.values(phHPO))
      .concat([
        {
          ...baseline('Phenotypes (SNOMED)', '', true),
          headerId: 'Phenotypes (SNOMED)',
        },
      ])
      .concat(Object.values(phSNO));

    const participantId = getParticipantId(famMembersNodes);
    const famMembersIds = allIDs.filter(id => id !== participantId);

    const rowsRemovedOfNotSharingRows = rows.filter(r => {
      if (!r.subheader && DXS_PHENOTYPES_HEADER_LABELS.includes(r.parentHeaderId)) {
        const partcipantDx = r[participantId] || '--';
        return partcipantDx !== '--' && isParticipantSharingDxOrPheno(r, famMembersIds);
      }
      return true;
    });

    rows = rowsRemovedOfNotSharingRows.filter((row, i) => {
      //removes empty rows
      if (row.subheader) {
        const hasContent =
          i + 1 >= rowsRemovedOfNotSharingRows.length
            ? false
            : !rowsRemovedOfNotSharingRows[i + 1].subheader;
        if (!hasContent) {
          return false;
        }
      }

      if (!row.leftfield || row.leftfield === '--') {
        return false;
      }
      return true;
    });

    return rows;
  }

  render() {
    const { participant } = this.props;
    const enhancedParticipant = { ...participant, relationship: '(this participant)' };

    const compNode = get(enhancedParticipant, 'family.family_compositions.hits.edges[0].node', {});
    const composition = compNode.composition;

    if (composition === 'proband-only') {
      return null;
    }

    const famMembersNodes = [enhancedParticipant].concat(
      get(compNode, 'family_members.hits.edges', []).map(ele => ele.node),
    );

    const builtRows = this.buildRows(famMembersNodes);

    if (hasTableSharingDxOrPhenotypes(builtRows)) {
      //<EntityContentSection/> is added here because it's possible that the table renders nothing and there is no easy way for the parent to know about it.
      return (
        <EntityContentSection
          title={`Participant's phenotypes/diagnoses shared with other family's members`}
        >
          <ParticipantDataTable
            columns={this.buildHeads(famMembersNodes)}
            data={sanitize(builtRows)}
          />
        </EntityContentSection>
      );
    }
    return null;
  }
}

export default FamilyTable;
