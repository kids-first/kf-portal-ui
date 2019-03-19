import React from 'react';
import styled from 'react-emotion';
import { withTheme } from 'emotion-theming';
import { compose } from 'recompose';
import SearchAll from '../SearchAll';
import Category from './Category';
import Row from 'uikit/Row';
import QuickFilterIcon from 'icons/QuickFilterIcon';
import StudyIcon from 'icons/StudyIcon';
import BiospecimenIcon from 'icons/BiospecimenIcon';
import ClinicalIcon from 'icons/ClinicalIcon';
import UploadIcon from 'icons/UploadIcon';
import FileIcon from 'icons/FileIcon';
import DemographicIcon from 'icons/DemographicIcon';

const Container = styled(Row)`
  height: 72px;
  width: 100%;
  border-left: 1px solid ${({ theme }) => theme.greyScale8};
  border-bottom: 1px solid ${({ theme }) => theme.greyScale8};
  background-color: white;
`;

// Categories are arranged so that they display alphabetically on the cohort builder based on the display name from arranger.
//  Check fields on display to make sure they are in alphabetical order.
const CATEGORY_FIELDS = {
  // Results in the Search All will appear in that order.
  searchAll: [
    // Study
    'study.data_access_authority',
    'study.short_name',

    // Demographic
    'ethnicity',
    'gender',
    'race',

    // Clinical
    'affected_status',
    // 'diagnoses.age_at_event_days',
    // 'outcome.age_at_event_days',
    // 'phenotype.age_at_event_days',
    // 'phenotype.ancestral_hpo_ids',
    'diagnoses.diagnosis',
    'diagnoses.diagnosis_category',
    'family.family_compositions.composition',
    // "Cannot query field "family__family_compositions__shared_phenotype_ids" on type "participantAggregations". Did you mean "family__family_compositions__shared_hpo_ids", "family__family_compositions__available_data_types", "family__family_compositions__composition", "family__family_compositions__family_members__kf_id", or "family__family_compositions__family_members__race"?"
    // 'family.family_compositions.shared_phenotype_ids',
    // "Cannot query field "outcome__is_disease_related" on type "participantAggregations". Did you mean "outcome__disease_related", "outcome__external_id", or "outcome__vital_status"?"
    'outcome.disease_related',
    // 'phenotype.hpo_phenotype_observed_text',
    'diagnoses.source_text_tumor_location',
    // "Invalid pivot field "outcome", not a nested field"
    // 'outcome.vital_status',

    // Available Data
    'available_data_types',
  ],
  quickSearch: [
    'available_data_types',
    'diagnoses.diagnosis',
    // TODO - test both, see which one is the good one
    'particpant.diagnosis_category',
    // 'diagnoses.diagnosis_category',
    'phenotype.hpo_phenotype_observed_text',
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
    'phenotype.ancestral_hpo_ids',
    'diagnoses.diagnosis',
    'diagnoses.diagnosis_category',
    'family.family_compositions.composition',
    // TODO - test both, see which one is the good one
    'family.family_compositions.shared_phenotype_ids',
    // 'family.family_compositions.shared_hpo_ids',
    'outcome.disease_related',
    'phenotype.hpo_phenotype_observed_text',
    'diagnoses.source_text_tumor_location',
    'outcome.vital_status',
  ],
  biospecimen: [
    'biospecimens.age_at_event_days',
    'biospecimens.analyte_type',
    'biospecimens.composition',
    'biospecimens.method_of_sample_procurement',
    'biospecimens.ncit_id_anatomical_site',
    'biospecimens.ncit_id_tissue_type',
    'biospecimens.source_text_tumor_descriptor',
  ],
  availableData: [
    'available_data_types',
    'files.experiment_strategies',
    'family.family_compositions.available_data_types',
  ],
};

const Categories = ({ theme, sqon, onSqonUpdate }) => (
  <Container>
    <SearchAll
      title={'Search all filters'}
      sqon={sqon}
      onSqonUpdate={onSqonUpdate}
      fields={CATEGORY_FIELDS.searchAll}
      color={theme.filterViolet}
    />
    <Category
      title="Quick Filters"
      sqon={sqon}
      onSqonUpdate={onSqonUpdate}
      fields={CATEGORY_FIELDS.quickSearch}
      color={theme.filterPurple}
    >
      <QuickFilterIcon fill={theme.filterPurple} />
    </Category>
    <Category
      title="Study"
      sqon={sqon}
      onSqonUpdate={onSqonUpdate}
      fields={CATEGORY_FIELDS.study}
      color={theme.studyRed}
    >
      <StudyIcon fill={theme.studyRed} />
    </Category>
    <Category
      title="Demographic"
      sqon={sqon}
      onSqonUpdate={onSqonUpdate}
      fields={CATEGORY_FIELDS.demographic}
      color={theme.demographicPurple}
    >
      <DemographicIcon fill={theme.demographicPurple} />
    </Category>
    <Category
      title="Clinical"
      sqon={sqon}
      onSqonUpdate={onSqonUpdate}
      fields={CATEGORY_FIELDS.clinical}
      color={theme.clinicalBlue}
    >
      <ClinicalIcon width={18} height={17} fill={theme.clinicalBlue} />
    </Category>
    <Category
      title="Biospecimens"
      sqon={sqon}
      onSqonUpdate={onSqonUpdate}
      fields={CATEGORY_FIELDS.biospecimen}
      color={theme.biospecimenOrange}
    >
      <BiospecimenIcon fill={theme.biospecimenOrange} />
    </Category>
    <Category
      title="Available Data"
      sqon={sqon}
      onSqonUpdate={onSqonUpdate}
      fields={CATEGORY_FIELDS.availableData}
      color={theme.dataBlue}
    >
      <FileIcon width={11} height={14} fill={theme.dataBlue} />
    </Category>

    {/* the below is not actually a Category */}
    <Category title="Upload IDs" color={theme.uploadYellow} fields={[]}>
      <UploadIcon fill={theme.uploadYellow} />
    </Category>
  </Container>
);

export default compose(withTheme)(Categories);
