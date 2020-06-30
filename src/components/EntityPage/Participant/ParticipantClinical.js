import * as React from 'react';
import get from 'lodash/get';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import flatMap from 'lodash/flatMap';
import isEmpty from 'lodash/isEmpty';

import theme from 'theme/defaultTheme';
import { EntityContentDivider, EntityContentSection } from '../';
import FamilyTable from './Utils/FamilyTable';
import sanitize from './Utils/sanitize';
import ParticipantDataTable from './Utils/ParticipantDataTable';
import graphql from 'services/arranger';
import { initializeApi } from '../../../services/api';
import { setSqons } from 'store/actionCreators/virtualStudies';
import {
  getDefaultSqon,
  MERGE_OPERATOR_STRATEGIES,
  MERGE_VALUES_STRATEGIES,
  setSqonValueAtIndex,
} from '../../../common/sqonUtils';
import { resetVirtualStudy } from '../../../store/actionCreators/virtualStudies';
import { store } from '../../../store';
import prettifyAge from './Utils/prettifyAge';
import { HPOLink, SNOMEDLink, MONDOLink, NCITLink } from '../../Utils/DiagnosisAndPhenotypeLinks';
import ClinicalIcon from 'icons/ClinicalIcon';
import BiospecimenIcon from 'icons/BiospecimenIcon';
import Tooltip from 'uikit/Tooltip';
import LoadingSpinner from 'uikit/LoadingSpinner';
import PropTypes from 'prop-types';
import './ParticipantClinical.css';

const cellBreak = (wrapper) => (
  <div style={{ wordBreak: 'break-word', textTransform: 'capitalize' }}>{wrapper.value}</div>
);

const PHENOTYPES_TABS = [
  {
    tabName: 'Observed',
    accessor: 'hpo_phenotype_observed',
  },
  {
    tabName: 'Not Observed',
    accessor: 'hpo_phenotype_not_observed',
  },
];

const filterOutParentDiagnoses = (diagnosis) => {
  const diagnosisEdges = diagnosis?.mondo?.hits?.edges || [];
  if (diagnosisEdges.length > 0) {
    return diagnosisEdges[0].node?.is_tagged;
  } else {
    return true;
  }
};

class ParticipantClinical extends React.Component {
  state = {
    diagnoses: [],
    phenotypes: [],
    hasLoadedDxs: false,
    hasLoadedPhenotypes: false,
    activePhenotypeTab: {
      tabName: 'Observed',
      accessor: 'hpo_phenotype_observed',
    },
  };

  static propTypes = {
    participant: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.dataIntoState();
  }

  diagHeads = [
    {
      Header: 'Diagnosis Category',
      accessor: 'diagnosis_category',
      Cell: (row) => {
        const category = row.value;
        const rowData = row.original;
        const biospecimensIds = rowData.biospecimens || [];
        const hasNoBioSpecimenIds = isEmpty(biospecimensIds);
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip
              html={`${hasNoBioSpecimenIds ? 'Clinical' : 'Histological'} Diagnosis`}
              style={{ marginRight: '10px' }}
            >
              {hasNoBioSpecimenIds ? (
                <ClinicalIcon size="18px" fill={theme.clinicalBlue} alt="clinical" />
              ) : (
                <BiospecimenIcon size="18px" fill={theme.biospecimenOrange} alt="histological" />
              )}
            </Tooltip>
            <div style={{ wordBreak: 'break-word', textTransform: 'capitalize' }}>{category}</div>
          </div>
        );
      },
    },
    {
      Header: 'Diagnosis (Mondo)',
      accessor: 'mondo_id_diagnosis',
      Cell: (wrapper) =>
        wrapper.value === '--' ? <div>--</div> : <MONDOLink mondo={wrapper.value} />,
    },
    {
      Header: 'Diagnosis (NCIT)',
      accessor: 'ncit_id_diagnosis',
      Cell: (wrapper) =>
        wrapper.value === '--' ? <div>--</div> : <NCITLink ncit={wrapper.value} />,
    },
    { Header: 'Diagnosis (Source Text)', accessor: 'source_text_diagnosis', Cell: cellBreak },
    { Header: 'Age at event', accessor: 'age_at_event_days', Cell: cellBreak },
    {
      Header: 'Mondo term shared with',
      accessor: 'shared_with',
      Cell: (wrapper) => {
        const participant = this.showParticipantNb(wrapper, 'diagnoses.mondo_id_diagnosis', [
          wrapper.original.mondo_id_diagnosis,
        ]);

        return participant;
      },
    },
    {
      Header: 'Specimen IDs',
      accessor: 'biospecimens',
      width: 175,
      Cell: (row) => {
        const biospecimensIds = row.value;
        return isEmpty(biospecimensIds) ? (
          <div>--</div>
        ) : (
          <div style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
            {biospecimensIds.join(', ')}
          </div>
        );
      },
    },
  ];

  phenoHeads = () => [
    {
      Header: 'Phenotype (HPO)',
      accessor: this.state.activePhenotypeTab.accessor,
      Cell: (wrapper) => (wrapper.value === '--' ? <div>--</div> : <HPOLink hpo={wrapper.value} />),
    },
    {
      Header: 'Phenotype (SNOMED)',
      accessor: 'snomed',
      Cell: (wrapper) =>
        wrapper.value === '--' ? <div>--</div> : <SNOMEDLink snomed={wrapper.value} />,
    },
    { Header: 'Phenotype (Source Text)', accessor: 'source_text_phenotype', Cell: cellBreak },
    { Header: 'Interpretation', accessor: 'interpretation', Cell: cellBreak },
    { Header: 'Age at event', accessor: 'age_at_event_days', Cell: cellBreak },
    {
      Header: 'HPO term shared with',
      accessor: 'shared_with',
      Cell: (wrapper) => {
        const participant = this.showParticipantNb(
          wrapper,
          wrapper.original.interpretation === 'Observed'
            ? 'phenotype.hpo_phenotype_observed'
            : 'phenotype.hpo_phenotype_not_observed',
          [wrapper.original.hpo],
        );

        return participant;
      },
    },
  ];

  diagnosisIntoState(api) {
    function call(diagnosis) {
      return graphql(api)({
        query: `query($sqon: JSON) {participant {hits(filters: $sqon) {total}}}`,
        variables: `{"sqon":{"op":"and","content":[{"op":"in","content":
        {"field":"diagnoses.mondo_id_diagnosis","value":["${diagnosis}"]}}]}}`,
      });
    }
    let diagnoses = get(this.props.participant, 'diagnoses.hits.edges', []).map(
      (ele) => Object.assign({}, get(ele, 'node', {})), //copy obj
    );

    diagnoses = diagnoses.filter((d) => filterOutParentDiagnoses(d));

    Promise.all(
      (() => {
        const temp = diagnoses.map((diag) =>
          //start ajax calls to know the shared with.
          call(diag.mondo_id_diagnosis),
        );

        diagnoses = diagnoses.map((diag) => {
          //make age more readable while we wait for the calls

          diag.age_at_event_days = prettifyAge(diag.age_at_event_days);

          return diag;
        });
        return temp;
      })(),
    ).then((nums) => {
      for (let i = 0; i < nums.length; i++) {
        diagnoses[i].shared_with = this.prettySharedWith(
          get(nums[i], 'data.participant.hits.total', '--'),
        );
      }

      this.setState({
        diagnoses: sanitize(diagnoses),
        hasLoadedDxs: true,
      }); //once we're ready, just tell the state, it'll do the rest
    });
  }

  phenotypeIntoState(api) {
    //stub for when the phenotypes are available
    function callObs(phenotype) {
      return graphql(api)({
        query: `query($sqon: JSON) {participant {hits(filters: $sqon) {total}}}`,
        variables: `{"sqon":{"op":"and","content":[{"op":"in","content":
        {"field":"phenotype.hpo_phenotype_observed","value":["${phenotype}"]}}]}}`,
      });
    }

    function callNotObs(phenotype) {
      return graphql(api)({
        query: `query($sqon: JSON) {participant {hits(filters: $sqon) {total}}}`,
        variables: `{"sqon":{"op":"and","content":[{"op":"in","content":
        {"field":"phenotype.hpo_phenotype_not_observed","value":["${phenotype}"]}}]}}`,
      });
    }

    let phenotypes = get(this.props.participant, 'phenotype.hits.edges', []).map(
      (ele) => Object.assign({}, get(ele, 'node', {})), //copy obj
    );

    phenotypes = flatMap(
      phenotypes.sort((a, b) => a.age_at_event_days - b.age_at_event_days),
      (pheno) => {
        //transform phenotypes while we wait for the calls

        if (pheno.observed) {
          pheno.interpretation = 'Observed';
          pheno.hpo = pheno.hpo_phenotype_observed;
          pheno.snomed = pheno.snomed_phenotype_observed;
        } else {
          pheno.interpretation = 'Not Observed';
          pheno.hpo = pheno.hpo_phenotype_not_observed;
          pheno.snomed = pheno.snomed_phenotype_not_observed;
        }

        pheno.age_at_event_days = prettifyAge(pheno.age_at_event_days);

        return [pheno];
      },
    );

    Promise.all(
      //start ajax calls to know the shared with.
      phenotypes.map((pheno) =>
        pheno.interpretation === 'Observed' ? callObs(pheno.hpo) : callNotObs(pheno.hpo),
      ),
    ).then((nums) => {
      for (let i = 0; i < nums.length; i++) {
        phenotypes[i].shared_with = this.prettySharedWith(
          get(nums[i], 'data.participant.hits.total', '--'),
        );
      }

      const sanitizePhenotypes = sanitize(phenotypes);
      const hasObserved = sanitizePhenotypes.filter((t) => t.interpretation === 'Observed') > 0;
      this.setState({
        phenotypes: sanitizePhenotypes,
        hasLoadedPhenotypes: true,
        activePhenotypeTab: hasObserved
          ? {
              tabName: 'Observed',
              accessor: 'hpo_phenotype_observed',
            }
          : {
              tabName: 'Not Observed',
              accessor: 'hpo_phenotype_not_observed',
            },
      }); //once we're ready, just tell the state, it'll do the rest
    });
  }

  dataIntoState() {
    const api = initializeApi({
      onError: (error) => console.error(error),
      onUnauthorized: (response) => {
        console.warn('Unauthorized', response);
      },
    });

    this.diagnosisIntoState(api);
    this.phenotypeIntoState(api);
  }

  prettySharedWith(amount) {
    if (amount === '--') return amount;
    else if (amount === 1) return `${amount} participant`;
    else return `${amount} participants`;
  }

  showParticipantNb = (wrapper, field, value) => {
    if (wrapper.value === '0 participants') return <div>0 participants</div>;

    const onClick = () => {
      store.dispatch(resetVirtualStudy());

      const newSqon = {
        op: 'in',
        content: {
          field: field,
          value: value,
        },
      };

      const modifiedSqons = setSqonValueAtIndex(
        getDefaultSqon(), //virtualStudy.sqons,
        0, //virtualStudy.activeIndex,
        newSqon,
        {
          operator: MERGE_OPERATOR_STRATEGIES.KEEP_OPERATOR,
          values: MERGE_VALUES_STRATEGIES.APPEND_VALUES,
        },
      );

      store.dispatch(setSqons(modifiedSqons));
    };

    return (
      <Link to={'/explore'} onClick={onClick}>
        {wrapper.value}
      </Link>
    );
  };

  setActivePhenotypeTab = (tabKey) => {
    const tab = PHENOTYPES_TABS.find((value) => value.accessor === tabKey);
    this.setState({
      activePhenotypeTab: {
        tabName: tab.tabName,
        accessor: tab.accessor,
      },
    });
  };

  render() {
    if (!this.state.hasLoadedPhenotypes || !this.state.hasLoadedDxs) {
      //make sure all data is loaded before deciding what to display.
      return <LoadingSpinner color="#a9adc0" size="50px" />;
    }
    const participant = this.props.participant;
    const diagnoses = this.state.diagnoses;
    const phenotypes = this.state.phenotypes;

    const hasDxs = diagnoses && diagnoses.length > 0;
    const hasPhenotype = phenotypes && phenotypes.length > 0;

    const hasDataToShow = hasDxs || hasPhenotype;

    if (!hasDataToShow) {
      return <span>{'No Clinical Data Reported'}</span>;
    }

    const tabsWithActive = PHENOTYPES_TABS.map((t) => ({
      ...t,
      isDisabled: phenotypes.filter((p) => p.interpretation === t.tabName).length === 0,
    }));

    return (
      <React.Fragment>
        {hasDxs && (
          <EntityContentSection title="Diagnoses">
            <ParticipantDataTable columns={this.diagHeads} data={diagnoses} />
          </EntityContentSection>
        )}
        {hasPhenotype && (
          <EntityContentSection
            title="Phenotypes"
            tabs={tabsWithActive}
            activeTab={this.state.activePhenotypeTab}
            setActiveTab={this.setActivePhenotypeTab}
            defaultTab={tabsWithActive.find((t) => !t.isDisabled).accessor}
          >
            <ParticipantDataTable
              columns={this.phenoHeads()}
              data={phenotypes.filter(
                (p) => p.interpretation === this.state.activePhenotypeTab.tabName,
              )}
            />
          </EntityContentSection>
        )}
        {participant.family_id && (
          <div>
            {hasDxs ? <EntityContentDivider /> : ''}
            <FamilyTable participant={participant} />
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default withRouter(ParticipantClinical);
