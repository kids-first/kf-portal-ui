import React from 'react';
import CardHeader from 'uikit/Card/CardHeader';
import ChartContentSpinner from 'components/Charts/ChartContentSpinner';

import { PhenotypeStore } from '../../OntologyBrowser/store';

import { DashboardCard } from '../styles';
import './Ontology.css';
import Sunburst from '../../Charts/Sunburst';

type OntologySunburstProps = {};
type OntologySunburstState = {
  data: Object | null;
  loading: boolean;
};

type FormatterDataType = { title: string; results: number };

const tooltipFormatter = (data: FormatterDataType) => `${data.results}\n\n${data.title}`;
const centerTextFormatter = (data: FormatterDataType) => `${data.results} ${data.title}`;

class OntologySunburst extends React.Component<OntologySunburstProps, OntologySunburstState> {
  state = {
    data: null,
    loading: true,
  };

  componentDidMount() {
    const ontologyStore = new PhenotypeStore();
    ontologyStore
      .fetch()
      .then(() => {
        const data = ontologyStore.getTree();
        if (data.length > 0) {
          this.setState({
            data: data[0],
            loading: false,
          });
        }
      })
      .catch((err) => console.error(err));
  }

  render() {
    const { data, loading } = this.state;
    const Header = <CardHeader title="Ontology" />;
    return (
      <DashboardCard Header={Header} inactive={loading}>
        {loading ? (
          <ChartContentSpinner />
        ) : (
          <div className="card-content-center">
            {data && (
              <Sunburst
                data={data!}
                tooltipFormatter={tooltipFormatter}
                centerTextFormatter={centerTextFormatter}
              />
            )}
          </div>
        )}
      </DashboardCard>
    );
  }
}

export default OntologySunburst;
