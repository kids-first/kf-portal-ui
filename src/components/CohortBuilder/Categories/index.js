import React from 'react';
import styled from 'react-emotion';
import { withTheme } from 'emotion-theming';
import { compose } from 'recompose';
import Search from './Search';
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

const CATEGORY_FIELDS = {
//Categories are arranged so that they display alphabetically on the cohort builder based on the display name from arranger.  Check fields on display to make sure they are in alphabetical order.
  quickSearch: [
    'available_data_types',
    'diagnoses.diagnosis',
    'diagnoses.diagnosis_category',
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
    'family.family_compositions.shared_hpo_ids',
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
    <Search />
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
    // {/* the below is not actually a Category */}
    // <Category title="Upload IDs" color={theme.uploadYellow} fields={[]}>
    //   <UploadIcon fill={theme.uploadYellow} />
    // </Category>
  </Container>
);

export default compose(withTheme)(Categories);
