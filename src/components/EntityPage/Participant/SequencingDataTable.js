import ControlledDataTable from "../../../uikit/DataTable/ControlledDataTable";
import React from "react";
import PropTypes from 'prop-types';

class SequencingDataTable extends React.Component {
  constructor(props) {
    super(props);

    this.cols = [
      { Header: "", columns: [{Header: "Experimental Strategy", accessor: "row"}]},
      { Header: "Source", columns: [
          { Header: "Unaligned Reads", accessor: "source.unalignedreads" },
          { Header: 'Aligned Reads', accessor: "source.alignedreads" },
          { Header: 'gVCF', accessor: 'source.gvcf' },
          { Header: 'Variant Calls', accessor: 'source.variant' },
        ]
      },
      { Header: "Hamonized", columns: [
          { Header: "Unaligned Reads", accessor: "harmonized.unalignedreads" },
          { Header: 'Aligned Reads', accessor: "harmonized.alignedreads" },
          { Header: 'gVCF', accessor: 'harmonized.gvcf' },
          { Header: 'Variant Calls', accessor: 'harmonized.variant' },
        ]
      }
    ];

    this.data = (() => {

      function makeBaseline(row) {
        const baselineNB = {unalignedreads: 0, alignedreads: 0, gvcf: 0, variant: 0};

        const baseline = {harmonized: {...baselineNB}, source: {...baselineNB}};

        return {...baseline, row: row}
      }

      let rows = ["WGS", "WXS", "RNA-Seq", "miRNA-Seq"].map(makeBaseline);

      const types = new Set(["Aligned Reads", "gVCF", "Unaligned Reads", "Variant Calls"]);

      props.files.forEach( fileTemp => {
        const file = fileTemp.node;

        if(types.has(file.data_type)) {
          const field = file.is_harmonized ? "harmonized" : "source";

          let correctRow = rows.find( ele => (ele.row === file.sequencing_experiments.hits.edges[0].node.experiment_strategy));

          const accessor = file.data_type.toString().toLowerCase().replace(/ /g, '');

          correctRow[field][accessor] = correctRow[field][accessor] +1;
        }
      });

      return rows
    })()
  }

  //https://codesandbox.io/s/03x3r0vx1l

  render() {
    return (
      <ControlledDataTable loading={false} columns={this.cols} data={this.data} dataTotalCount={3} onFetchData={() => null}/>
    )
  }
}

SequencingDataTable.propTypes = {
  files: PropTypes.array.isRequired
};

export default SequencingDataTable