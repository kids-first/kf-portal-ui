import ControlledDataTable from "../../../uikit/DataTable/ControlledDataTable";
import React from "react";
import PropTypes from 'prop-types';
import Holder from "./Holder";
import { Link } from 'react-router-dom';

class SequencingDataTable extends React.Component {
  constructor(props) {
    super(props);

    function andCells(arr) {
      function makeCell(wrapper) {
        if(wrapper.value === 0) return <div>0</div>;

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
              ${  //string comprehension is weird. Needs direct return type. Wrapping in "instant" lambda works
          (() => {
            const strat = wrapper.row.leftField;

            if(typeof strat === "undefined") return "";

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
                       "${wrapper.column.parentColumn.Header === "Harmonized"}"
                    ]
                 }
              }
           ]
        }
      `;

        return <Link to={url}>{wrapper.value}</Link>
      }

      return arr.map( topObj => {
        return {
          Header: topObj.Header,
          columns: topObj.columns.map( botObj => {
            return {...botObj, Cell: makeCell }
          })
        }
      })
    }

    //Headers of headers: https://codesandbox.io/s/03x3r0vx1l
    this.summaryCols = andCells([
      { Header: "Source", columns: [
          { Header: "Unaligned Reads", accessor: "source.unalignedreads" },
          { Header: 'Aligned Reads', accessor: "source.alignedreads" }, //https://kf-qa.netlify.com/participant/PT_3DPEF7PD#summary a les 2
          { Header: 'gVCF', accessor: 'source.gvcf' },
          { Header: 'Variant Calls', accessor: 'source.variantcalls' },
        ]
      },
      { Header: "Harmonized", columns: [
          { Header: "Unaligned Reads", accessor: "harmonized.unalignedreads" },
          { Header: 'Aligned Reads', accessor: "harmonized.alignedreads" },
          { Header: 'gVCF', accessor: 'harmonized.gvcf' },
          { Header: 'Variant Calls', accessor: 'harmonized.variantcalls' },
        ]
      }
    ]);

    this.breakdownCols = [
      { Header: "May have missing strategies!", columns: [{Header: "Strategy", accessor: "leftField"}]}, //https://kf-qa.netlify.com/participant/PT_3FV3E420#summary
    ].concat(this.summaryCols);

    function makeBaseline() {
      const baselineNB = {unalignedreads: 0, alignedreads: 0, gvcf: 0, variantcalls: 0};

      return {harmonized: {...baselineNB}, source: {...baselineNB}};
    }

    this.types = new Set(["Aligned Reads", "gVCF", "Unaligned Reads", "Variant Calls"]);

    function normalize(thing) {
      return thing.toString().toLowerCase().replace(/ /g, '');
    }

    this.summaryData = (() => {
      let obj = makeBaseline();

      props.files.forEach( fileTemp => {
        const file = fileTemp.node;

        if(this.types.has(file.data_type)) {
          const field = file.is_harmonized ? "harmonized" : "source";

          obj[field][normalize(file.data_type)]++;
        }
      });

      return [obj];
    })();

    this.breakdownData = (() => {

      function makeBaselineRow(row) {
        return {...makeBaseline(), leftField: row}
      }

      let rows = ["WGS", "WXS", "RNA-Seq", "miRNA-Seq", "N/A"].map(makeBaselineRow);

      props.files.forEach( fileTemp => {
        const file = fileTemp.node;

        if(this.types.has(file.data_type)) {
          const field = file.is_harmonized ? "harmonized" : "source";

          /*
          Some have no experiment strategy (no node!). We're thus testing to see if there's one.

          https://kf-qa.netlify.com/participant/PT_3FV3E420#summary
           */
          let correctRow = null;
          try {
            correctRow = rows.find( ele => (ele.leftField === file.sequencing_experiments.hits.edges[0].node.experiment_strategy));
          } catch (noStrategy) {
            correctRow = rows[4];
          }

          correctRow[field][normalize(file.data_type)]++;
        }
      });

      return rows
    })()
  }

  render() {
    return (
      <Holder>
        <ControlledDataTable label={"All data"} loading={false} columns={this.summaryCols} data={this.summaryData} dataTotalCount={-1} onFetchData={() => null}/>
        <ControlledDataTable label={"Strategies"} loading={false} columns={this.breakdownCols} data={this.breakdownData} dataTotalCount={-1} onFetchData={() => null}/>
      </Holder>
    )
  }
}

SequencingDataTable.propTypes = {
  files: PropTypes.array.isRequired
};

export default SequencingDataTable