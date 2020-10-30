import React from 'react';
import isEqual from 'lodash/isEqual';
import { Spinner } from 'uikit/Spinner';
import { PhenotypeStore } from '../../OntologyBrowser/store';
import { TreeNode } from '../../OntologyBrowser/Model';
import Sunburst from 'components/UI/Charts/Sunburst/Sunburst';
import { Sqon } from 'store/sqon';
import './Ontology.css';
import { generateEmptyPhenotype } from 'store/sunburstTypes';

type OntologySunburstProps = {
  sqon: Sqon;
  width?: number;
  height?: number;
};
type OntologySunburstState = {
  data: Object | null;
  loading: boolean;
};

const tooltipFormatter = (data: TreeNode) => `${data.results}\n\n${data.title}`;
const centerTextFormatter = (data: TreeNode) => `${data.results} ${data.title}`;
const centerNoDataTextFormatter = (data: TreeNode) => `${data.title}`;

class OntologySunburst extends React.Component<OntologySunburstProps, OntologySunburstState> {
  state = {
    data: null,
    loading: true,
  };
  ontologyStore: PhenotypeStore;

  constructor(props: OntologySunburstProps) {
    super(props);
    this.ontologyStore = new PhenotypeStore();
  }

  componentDidMount() {
    this.fetchOntology();
  }

  componentDidUpdate(prevProps: OntologySunburstProps) {
    if (!isEqual(prevProps.sqon, this.props.sqon)) {
      this.fetchOntology();
    }
  }

  fetchOntology() {
    const sqon = this.props.sqon || null;
    this.setState({ loading: true });
    this.ontologyStore
      .fetch('observed_phenotype', sqon)
      .then(() => {
        const data = this.ontologyStore.getTree();
        if (data.length > 0) {
          this.setState({
            data: data[0],
            loading: false,
          });
        } else {
          this.setState({
            data: null,
            loading: false,
          });
        }
      })
      .catch((err) => console.error(err));
  }

  render() {
    const { data, loading } = this.state;
    const { height, width } = this.props;
    return (
      <>
        {loading ? (
          <Spinner size={'large'} />
        ) : (
          <div className="card-content-center">
            {data !== null ? (
              <Sunburst
                data={data!}
                height={height}
                width={width}
                tooltipFormatter={tooltipFormatter}
                centerTextFormatter={centerTextFormatter}
              />
            ) : (
              <Sunburst
                isEmpty
                data={generateEmptyPhenotype()}
                height={height}
                width={width}
                centerTextFormatter={centerNoDataTextFormatter}
              />
            )}
          </div>
        )}
      </>
    );
  }
}

export default OntologySunburst;
