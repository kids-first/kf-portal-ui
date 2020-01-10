import React from 'react';
import autobind from 'auto-bind-es5';

import SearchAll from '../SearchAll';
import Category from './Category';
import ActionCategory from './ActionCategory';
import Row from 'uikit/Row';
import QuickFilterIcon from 'icons/QuickFilterIcon';
import StudyIcon from 'icons/StudyIcon';
import BiospecimenIcon from 'icons/BiospecimenIcon';
import ClinicalIcon from 'icons/ClinicalIcon';
import UploadIcon from 'icons/UploadIcon';
import FileIcon from 'icons/FileIcon';
import DemographicIcon from 'icons/DemographicIcon';
import { SQONdiff } from 'components/Utils';
import { registerModal } from '../../Modal/modalFactory';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';

import { openModal } from '../../../store/actionCreators/ui/modalComponent';
import { store } from '../../../store';
import SearchByIdModal from '../SearchById/SearchByIdModal';
import theme from 'theme/defaultTheme';

import '../CohortBuilder.css';

// Categories are arranged so that they display alphabetically on the cohort builder based on the display name from arranger.
//  Check fields on display to make sure they are in alphabetical order.
const CATEGORY_FIELDS = {
  // Results in the Search All will appear in that order.
  searchAll: [
    // Study
    'study.data_access_authority',
    'is_proband',
    'study.short_name',

    // Demographic
    'ethnicity',
    'gender',
    'race',

    // Clinical
    'affected_status',
    'diagnoses.age_at_event_days',
    'outcome.age_at_event_days',
    'phenotype.age_at_event_days',
    'diagnoses.mondo_id_diagnosis',
    'diagnoses.ncit_id_diagnosis',
    'diagnoses.source_text_diagnosis',
    'diagnoses.diagnosis_category',
    'family.family_compositions.composition',
    'family.family_compositions.shared_hpo_ids',
    'outcome.disease_related',
    'phenotype.source_text_phenotype',
    'phenotype.hpo_phenotype_not_observed',
    'phenotype.hpo_phenotype_observed',
    'diagnoses.source_text_tumor_location',
    'outcome.vital_status',

    // Biospecimen
    'biospecimens.age_at_event_days',
    'biospecimens.diagnoses.age_at_event_days',
    'biospecimens.analyte_type',
    'biospecimens.source_text_anatomical_site',
    'biospecimens.ncit_id_anatomical_site',
    'biospecimens.composition',
    'biospecimens.consent_type',
    'biospecimens.diagnoses.mondo_id_diagnosis',
    'biospecimens.diagnoses.ncit_id_diagnosis',
    'biospecimens.diagnoses.source_text_diagnosis',
    'biospecimens.method_of_sample_procurement',
    'biospecimens.source_text_tissue_type',
    'biospecimens.ncit_id_tissue_type',
    'biospecimens.source_text_tumor_descriptor',

    // Available Data
    'available_data_types',
    'files.sequencing_experiments.experiment_strategy',
    'family.family_compositions.available_data_types',
  ],
  quickSearch: [
    'available_data_types',
    'diagnoses.diagnosis_category',
    'phenotype.hpo_phenotype_not_observed',
    'phenotype.hpo_phenotype_observed',
    'is_proband',
    'study.short_name',
  ],
  study: ['study.data_access_authority', 'is_proband', 'study.short_name'],
  demographic: ['ethnicity', 'gender', 'race'],
  clinical: [
    'affected_status',
    'diagnoses.age_at_event_days',
    'outcome.age_at_event_days',
    'phenotype.age_at_event_days',
    'diagnoses.mondo_id_diagnosis',
    'diagnoses.ncit_id_diagnosis',
    'diagnoses.source_text_diagnosis',
    'diagnoses.diagnosis_category',
    'family.family_compositions.composition',
    'family.family_compositions.shared_hpo_ids',
    'outcome.disease_related',
    'phenotype.hpo_phenotype_not_observed',
    'phenotype.hpo_phenotype_observed',
    'phenotype.source_text_phenotype',
    'diagnoses.source_text_tumor_location',
    'outcome.vital_status',
  ],
  biospecimen: [
    'biospecimens.age_at_event_days',
    'biospecimens.diagnoses.age_at_event_days',
    'biospecimens.analyte_type',
    'biospecimens.source_text_anatomical_site',
    'biospecimens.ncit_id_anatomical_site',
    'biospecimens.composition',
    'biospecimens.consent_type',
    'biospecimens.diagnoses.mondo_id_diagnosis',
    'biospecimens.diagnoses.ncit_id_diagnosis',
    'biospecimens.diagnoses.source_text_diagnosis',
    'biospecimens.method_of_sample_procurement',
    'biospecimens.source_text_tissue_type',
    'biospecimens.ncit_id_tissue_type',
    'biospecimens.source_text_tumor_descriptor',
  ],
  availableData: [
    'available_data_types',
    'files.sequencing_experiments.experiment_strategy',
    'family.family_compositions.available_data_types',
  ],
};

export default class Categories extends React.Component {
  constructor(props) {
    super(props);
    this.initialSqon = props.sqon;
    registerModal('SearchByIdModal', SearchByIdModal);
    autobind(this);
  }

  trackCategoryAction(title) {
    const { sqon } = this.props;
    const addedSQON = SQONdiff(sqon, this.initialSqon);

    trackUserInteraction({
      category: `${TRACKING_EVENTS.categories.cohortBuilder.filters._cohortBuilderFilters} - ${title}`,
      action: `${TRACKING_EVENTS.actions.apply} Selected Filters`,
      label: JSON.stringify({ added_sqon: addedSQON, result_sqon: sqon }),
    });

    this.initialSqon = sqon;
  }

  handleSqonUpdate(title, ...args) {
    this.trackCategoryAction(title);
    this.props.onSqonUpdate(...args);
  }

  handleUploadIdsClick() {
    store.dispatch(openModal('SearchByIdModal', {}, 'search-by-id-modal'));
  }

  render() {
    const { sqon } = this.props;

    return (
      <Row className="cb-categories-content">
        <SearchAll
          title={'Search all filters'}
          sqon={sqon}
          onSqonUpdate={this.handleSqonUpdate}
          fields={CATEGORY_FIELDS.searchAll}
          color={theme.filterViolet}
        />
        <Category
          title="Quick Filters"
          sqon={sqon}
          onSqonUpdate={this.handleSqonUpdate}
          fields={CATEGORY_FIELDS.quickSearch}
          color={theme.filterPurple}
          anchorId={'anchor-quick-filters'}
        >
          <QuickFilterIcon fill={theme.filterPurple} />
        </Category>
        <Category
          title="Study"
          sqon={sqon}
          onSqonUpdate={this.handleSqonUpdate}
          fields={CATEGORY_FIELDS.study}
          color={theme.studyRed}
          anchorId={'anchor-study'}
        >
          <StudyIcon fill={theme.studyRed} />
        </Category>
        <Category
          title="Demographic"
          sqon={sqon}
          onSqonUpdate={this.handleSqonUpdate}
          fields={CATEGORY_FIELDS.demographic}
          color={theme.demographicPurple}
          anchorId={'anchor-demographic'}
        >
          <DemographicIcon fill={theme.demographicPurple} width="14px" height="17px" />
        </Category>
        <Category
          title="Clinical"
          sqon={sqon}
          onSqonUpdate={this.handleSqonUpdate}
          fields={CATEGORY_FIELDS.clinical}
          color={theme.clinicalBlue}
          anchorId={'anchor-clinical'}
        >
          <ClinicalIcon width="18px" height="17px" fill={theme.clinicalBlue} />
        </Category>
        <Category
          title="Biospecimens"
          sqon={sqon}
          onSqonUpdate={this.handleSqonUpdate}
          fields={CATEGORY_FIELDS.biospecimen}
          color={theme.biospecimenOrange}
          anchorId={'anchor-biospecimens'}
        >
          <BiospecimenIcon fill={theme.biospecimenOrange} />
        </Category>
        <Category
          title="Available Data"
          sqon={sqon}
          onSqonUpdate={this.handleSqonUpdate}
          fields={CATEGORY_FIELDS.availableData}
          color={theme.dataBlue}
          anchorId={'anchor-available-data'}
        >
          <FileIcon width="11px" height="14px" fill={theme.dataBlue} />
        </Category>
          <ActionCategory
            title="Upload IDs"
            color={theme.uploadYellow}
            onClick={this.handleUploadIdsClick}
          >
            <UploadIcon fill={theme.uploadYellow} width="13px" height="16px" />
          </ActionCategory>
      </Row>
    );
  }
}
