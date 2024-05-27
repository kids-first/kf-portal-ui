import { IFileEntity, IFileStudyEntity } from 'graphql/files/models';
import { toNodes } from 'graphql/utils/helpers';

import { keepOnly } from 'utils/helper';

import { makeUniqueWords as unique } from '../../helpers';

const joinUniquely = (l: string[]) => unique(l).join(',');

const extractFileMetaData = (file: IFileEntity) => ({
  fhir_document_reference: file.fhir_document_reference,
  file_id: file.file_id,
  external_file_id: file.external_id,
  file_name: file.file_name,
  data_category: file.data_category,
  data_type: file.data_type,
  file_format: file.file_format,
  repository: file.repository,
  acl: joinUniquely(file.acl),
  access_url: file.access_urls,
});

const extractParticipantMetaData = (participants: any[]) => {
  const diagnosis = participants.flatMap((participant) => toNodes(participant.diagnosis));
  const outcomes = participants.flatMap((participant) => toNodes(participant.outcomes));
  const phenotype = participants.flatMap((participant) => toNodes(participant.phenotype));
  const relation = participants.flatMap((participant) =>
    participant.family ? toNodes(participant.family.relations_to_proband) : '',
  );

  return {
    // Removed temporarily due to bug
    // case_id: joinUniquely(participants.map((x) => x.participant_id)),
    external_participant_ids: joinUniquely(participants.map((x) => x.external_id)),
    proband: joinUniquely(participants.map((x) => `${x.participant_id}: ${x.is_proband}`)),
    // Removed temporarily due to bug
    // ethnicity: joinUniquely(participants.map((x) => x.ethnicity)),
    // gender: joinUniquely(participants.map((x) => x.sex)),
    // race: joinUniquely(participants.map((x) => x.race)),
    age_at_participant_diagnosis: joinUniquely(diagnosis.map((d) => d.age_at_event_days)),
    age_at_vital_status: joinUniquely(outcomes.map((o) => o.age_at_event_days.value)),
    age_at_observed_phenotype: joinUniquely(phenotype.map((p) => p.age_at_event_days)),
    diagnosis_mondo: joinUniquely(diagnosis.map((d) => d.mondo_display_term)),
    diagnosis_ncit: joinUniquely(diagnosis.map((d) => d.ncit_id_diagnosis)),
    diagnosis_source_text: joinUniquely(diagnosis.map((d) => d.source_text)),
    family_id: joinUniquely(participants.map((x) => x.families_id)),
    family_composition: joinUniquely(participants.map((x) => x.family_type)),
    family_role: joinUniquely(relation.map((r) => r.role)),
    observed_phenotype_hpo: joinUniquely(phenotype.map((p) => p.hpo_phenotype_observed)),
    not_observed_phenotype_hpo: joinUniquely(phenotype.map((p) => p.hpo_phenotype_not_observed)),
    observed_phenotype_source_text: joinUniquely(phenotype.map((p) => p.source_text)),
    vital_status: joinUniquely(outcomes.map((o) => o.vital_status)),
  };
};

const extractBioSpecimenMetaData = (biospecimens: any[]) => {
  const diagnoses = biospecimens.flatMap((x) => toNodes(x.diagnoses));
  return {
    sample_id: joinUniquely(biospecimens.map((x) => x.sample_id)),
    sample_type: joinUniquely(biospecimens.map((x) => x.sample_type)),
    external_sample_id: joinUniquely(biospecimens.map((x) => x.external_sample_id)),
    collection_sample_type: joinUniquely(biospecimens.map((x) => x.collection_sample_type)),
    age_at_biospecimen_collection: joinUniquely(
      biospecimens.map((x) => x.age_at_biospecimen_collection),
    ),
    age_at_histological_diagnosis: joinUniquely(diagnoses.map((d) => d.age_at_event.value)),
    tumor_descriptor: joinUniquely(diagnoses.map((d) => d.source_text_tumor_descriptor)),
    method_of_sample_procurement: joinUniquely(
      biospecimens.map((d) => d.collection_method_of_sample_procurement),
    ),
    tumor_location: joinUniquely(diagnoses.map((d) => d.source_text_tumor_location)),
    histological_diagnosis_source_text: joinUniquely(diagnoses.map((d) => d.source_text)),
    histological_diagnosis_ncit: joinUniquely(diagnoses.map((d) => d.diagnosis_ncit)),
    histological_diagnosis_mondo: joinUniquely(diagnoses.map((d) => d.mondo_display_term)),
    dbgap_consent_code: joinUniquely(biospecimens.map((x) => x.dbgap_consent_code)),
    consent_type: joinUniquely(biospecimens.map((x) => x.consent_type)),
    anatomical_site_source_text: joinUniquely(biospecimens.map((x) => x.collection_anatomy_site)),
  };
};

const extractSequentialExperimentMetaData = (sequentialExperiments: any[]) => ({
  experimental_strategy: joinUniquely(sequentialExperiments.map((x) => x.experiment_strategy)),
  platform: joinUniquely(sequentialExperiments.map((x) => x.platform)),
  instrument_model: joinUniquely(sequentialExperiments.map((x) => x.instrument_model)),
  library_strand: joinUniquely(sequentialExperiments.map((x) => x.library_strand)),
  is_paired_end: joinUniquely(sequentialExperiments.map((x) => x.is_paired_end)),
});

const extractStudyMetaData = (study: IFileStudyEntity) => ({
  investigation: study.study_code,
  study_name: study.study_name,
  study_program: study.program,
  study_domain: study.domain,
});

export const extractMetadata = (file: IFileEntity) => {
  if (!file || !Object.keys(file).length) {
    return {};
  }

  const sequentialExperiments = toNodes(file.sequencing_experiment);
  const participants = toNodes(file.participants);
  const biospecimens = participants.flatMap((participant) => toNodes(participant.biospecimens));

  const fileMetaData = extractFileMetaData(file);
  const participantsMetaData = extractParticipantMetaData(participants);
  const biospecimensMetaData = extractBioSpecimenMetaData(biospecimens);
  const sequentialExperimentsMetaData = extractSequentialExperimentMetaData(sequentialExperiments);
  const studyMetaData = extractStudyMetaData(file.study);

  return keepOnly({
    ...fileMetaData,
    ...participantsMetaData,
    ...biospecimensMetaData,
    ...sequentialExperimentsMetaData,
    ...studyMetaData,
    reference_genome: null,
  });
};
