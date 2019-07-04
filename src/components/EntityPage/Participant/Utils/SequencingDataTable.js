import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ParticipantDataTable from './ParticipantDataTable';

const defaults = 'Not Available';

class SequencingDataTable extends React.Component {
  constructor(props) {
    super(props);

    function andCells(arr) {
      function makeCell(wrapper) {
        if (wrapper.value === 0 || wrapper.column.Header === 'Strategy')
          return <div>{wrapper.value}</div>;

        const url = `/search/file?sqon=
        {  
           "op":"and",
           "content":[  
              {  
                 "op":"in",
                 "content":{  
                    "field":"data_type",
                    "value":[  
                       "${wrapper.column.Header}"
                    ]
                 }
              },
              ${
                //string comprehension is weird. Needs direct return type. Wrapping in "instant" lambda works
                (() => {
                  const strat = wrapper.row.leftField;

                  if (strat === defaults) return '';

                  return `
                    
                    {  
                       "op":"in",
                       "content":{  
                          "field":"sequencing_experiments.experiment_strategy",
                          "value":[  
                             "${strat}"
                          ]
                       }
                    },
                    
                  `;
                })()
              }
              {  
                 "op":"in",
                 "content":{  
                    "field":"is_harmonized",
                    "value":[  
                       "${wrapper.column.parentColumn.Header === 'Harmonized'}"
                    ]
                 }
              },
              {  
                 "op":"in",
                 "content":{  
                    "field":"participants.kf_id",
                    "value":[  
                       "${props.participantID}"
                    ]
                 }
              }
           ]
        }
        `;

        function sanitizeURL() {
          let clean = '';
          let escaped = false;

          for (let i = 0; i < url.length; i++) {
            const char = url.charAt(i);

            if (char === '"') escaped = !escaped;
            else if (!escaped && (char === ' ' || char === '\n')) continue;

            clean += char;
          }

          return clean;
        }

        return <Link to={sanitizeURL()}>{wrapper.value}</Link>;
      }

      return arr.map(topObj => {
        return {
          Header: topObj.Header,
          columns: topObj.columns.map(botObj => {
            return { ...botObj, Cell: makeCell };
          }),
        };
      });
    }

    //Headers of headers: https://codesandbox.io/s/03x3r0vx1l
    this.breakdownCols = andCells([
      { Header: '', columns: [{ Header: 'Strategy', accessor: 'leftField' }] }, //https://kf-qa.netlify.com/participant/PT_3FV3E420#summary
      {
        Header: 'Source',
        columns: [
          { Header: 'Unaligned Reads', accessor: 'source.unalignedreads' },
          { Header: 'Aligned Reads', accessor: 'source.alignedreads' }, //https://kf-qa.netlify.com/participant/PT_3DPEF7PD#summary a les 2
          { Header: 'gVCF', accessor: 'source.gvcf' },
          { Header: 'Variant Calls', accessor: 'source.variantcalls' },
        ],
      },
      {
        Header: 'Harmonized',
        columns: [
          { Header: 'Unaligned Reads', accessor: 'harmonized.unalignedreads' },
          { Header: 'Aligned Reads', accessor: 'harmonized.alignedreads' },
          { Header: 'gVCF', accessor: 'harmonized.gvcf' },
          { Header: 'Variant Calls', accessor: 'harmonized.variantcalls' },
        ],
      },
    ]);

    this.breakdownData = () => {
      function makeBaselineRow(row) {
        const baselineNB = { unalignedreads: 0, alignedreads: 0, gvcf: 0, variantcalls: 0 };

        const baseline = { harmonized: { ...baselineNB }, source: { ...baselineNB } };

        return { ...baseline, leftField: row };
      }

      let rows = ['WGS', 'WXS', 'RNA-Seq', 'miRNA-Seq', defaults].map(makeBaselineRow);

      const types = new Set(['Aligned Reads', 'gVCF', 'Unaligned Reads', 'Variant Calls']);

      props.files.forEach(fileTemp => {
        const file = fileTemp.node;

        if (types.has(file.data_type)) {
          const field = file.is_harmonized ? 'harmonized' : 'source';

          /*
          Some have no experiment strategy (no node!). We're thus testing to see if there's one.

          https://kf-qa.netlify.com/participant/PT_3FV3E420#summary
           */
          let correctRow = null;
          try {
            correctRow = rows.find(
              ele =>
                ele.leftField ===
                file.sequencing_experiments.hits.edges[0].node.experiment_strategy,
            );
          } catch (noStrategy) {
            correctRow = rows[4];
          }

          correctRow[field][
            file.data_type
              .toString()
              .toLowerCase()
              .replace(/ /g, '')
          ]++;
        }
      });

      return rows;
    };
  }

  render() {
    return <ParticipantDataTable columns={this.breakdownCols} data={this.breakdownData()} />;
  }
}

SequencingDataTable.propTypes = {
  files: PropTypes.array.isRequired,
  participantID: PropTypes.string.isRequired,
};

export default SequencingDataTable;
