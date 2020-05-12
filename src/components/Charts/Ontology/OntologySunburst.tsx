import React, { Fragment } from 'react';
import isEqual from 'lodash/isEqual';

import ChartContentSpinner from 'components/Charts/ChartContentSpinner';
import { PhenotypeStore } from '../../OntologyBrowser/store';
import Sunburst from 'components/UI/Charts/Sunburst/Sunburst';
import { Sqon } from 'types';
import './Ontology.css';

type OntologySunburstProps = {
  sqon: Sqon;
  width?: number;
  height?: number;
};
type OntologySunburstState = {
  data: Object | null;
  loading: boolean;
};

type FormatterDataType = { title: string; results: number };

const tooltipFormatter = (data: FormatterDataType) => `${data.results}\n\n${data.title}`;
const centerTextFormatter = (data: FormatterDataType) => `${data.results} ${data.title}`;
const centerNoDataTextFormatter = (data: FormatterDataType) => `${data.title}`;

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
      .fetch(sqon)
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
    // const Header = <CardHeader title="Observed Phenotypes" />;
    return (
      <Fragment>
        {loading ? (
          <ChartContentSpinner />
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
                data={{ title: 'No Data', children: [] }}
                height={height}
                width={width}
                centerTextFormatter={centerNoDataTextFormatter}
              />
            )}
          </div>
        )}
      </Fragment>
    );
  }
}

export default OntologySunburst;
