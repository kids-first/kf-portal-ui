import intl from 'react-intl-universal';
import { IDictionary as FiltersDict } from '@ferlab/ui/core/components/filters/types';
import { IProTableDictionary } from '@ferlab/ui/core/components/ProTable/types';
import { IDictionary as QueryBuilderDict } from '@ferlab/ui/core/components/QueryBuilder/types';
import { SET_ID_PREFIX } from '@ferlab/ui/core/data/sqon/types';

import { IUserSetOutput, IUserSetOutputAlias } from 'services/api/savedSet/models';

import { numberWithCommas } from './string';

export const getEntityExpandableTableMultiple = () => ({
  hideTranscript: intl.get('screen.variants.consequences.hideTranscript'),
  showTranscript: (count: number) =>
    intl.get('screen.variants.consequences.showTranscript', { count }),
  seeLess: intl.get('see.less'),
  seeMore: intl.get('see.more'),
  noDataAvailable: intl.get('no.data.available'),
});

export const getEntityConsequenceDictionary = () => ({
  consequence: intl.get('screen.variants.consequences.consequence'),
  impactTag: {
    modifier: intl.get('screen.variants.consequences.impactTag.modifier'),
    low: intl.get('screen.variants.consequences.impactTag.low'),
    moderate: intl.get('screen.variants.consequences.impactTag.moderate'),
    high: intl.get('screen.variants.consequences.impactTag.high'),
  },
  aaColumnTooltip: intl.get('screen.variants.consequences.aaColumnTooltip'),
  aaColumn: intl.get('screen.variants.consequences.aaColumn'),
  cdnaChangeColumn: intl.get('screen.variants.consequences.cdnaChangeColumn'),
  strand: intl.get('screen.variants.consequences.strand'),
  vep: intl.get('screen.variants.consequences.vep'),
  predictions: {
    predictions: intl.get('screen.variants.consequences.predictions.predictions'),
    sift: intl.get('screen.variants.consequences.predictions.sift'),
    polyphen2: intl.get('screen.variants.consequences.predictions.polyphen2'),
    fathmm: intl.get('screen.variants.consequences.predictions.fathmm'),
    cadd: intl.get('screen.variants.consequences.predictions.cadd'),
    caddRaw: intl.get('screen.variants.consequences.predictions.caddRaw'),
    caddPhred: intl.get('screen.variants.consequences.predictions.caddPhred'),
    dann: intl.get('screen.variants.consequences.predictions.dann'),
    lrt: intl.get('screen.variants.consequences.predictions.lrt'),
    revel: intl.get('screen.variants.consequences.predictions.revel'),
  },
  conservationColumn: intl.get('screen.variants.consequences.conservationColumn'),
  transcript: intl.get('screen.variants.consequences.transcript'),
  canonical: intl.get('screen.variants.consequences.canonical'),
  refSeq: intl.get('screen.variants.consequences.refSeq'),
  geneConsequence: intl.get('screen.variants.consequences.geneConsequence'),
  gene: intl.get('screen.variants.consequences.gene'),
  omim: intl.get('screen.variants.consequences.omim'),
});

export const getProTableDictionary = (): IProTableDictionary => ({
  itemCount: {
    result: intl.get('global.proTable.result'),
    results: intl.get('global.proTable.results'),
    noResults: intl.get('global.proTable.noResults'),
    of: intl.get('global.proTable.of'),
    selected: intl.get('global.proTable.selected'),
    selectedPlural: intl.get('global.proTable.selectedPlural'),
    selectAllResults: intl.get('global.proTable.selectAll'),
    clear: intl.get('global.proTable.clear'),
    clearFilters: intl.get('global.proTable.clearFilters'),
  },
  pagination: {
    first: intl.get('global.proTable.pagination.first'),
    previous: intl.get('global.proTable.pagination.previous'),
    next: intl.get('global.proTable.pagination.next'),
    view: intl.get('global.proTable.pagination.view'),
  },
  numberFormat: numberWithCommas,
});

export const getFiltersDictionary = (): FiltersDict => ({
  actions: {
    all: intl.get('global.filters.actions.all'),
    apply: intl.get('global.filters.actions.apply'),
    clear: intl.get('global.filters.actions.clear'),
    less: intl.get('global.filters.actions.less'),
    more: intl.get('global.filters.actions.more'),
    none: intl.get('global.filters.actions.none'),
    dictionary: intl.get('global.filters.actions.dictionary'),
  },
  operators: {
    between: intl.get('global.filters.operators.between'),
    lessThan: intl.get('global.filters.operators.lessthan'),
    lessThanOfEqual: intl.get('global.filters.operators.lessthanorequal'),
    greaterThan: intl.get('global.filters.operators.greaterthan'),
    greaterThanOrEqual: intl.get('global.filters.operators.greaterthanorequal'),
  },
  range: {
    actualInterval: 'Actual Interval',
    noData: 'No Data',
    from: 'from',
    to: 'to',
    is: intl.get('global.filters.range.is'),
    unit: 'unit',
    min: 'min',
    max: 'max',
  },
  checkBox: {
    noData: intl.get('api.noData'),
    searchPlaceholder: intl.get('global.filters.checkbox.placeholder'),
  },
  messages: {
    errorNoData: intl.get('global.filters.messages.empty'),
  },
  quickFilter: {
    emptyMessage: intl.get('global.quickFilter.emptyMessage'),
    menuTitle: intl.get('global.quickFilter.menuTitle'),
    placeholder: intl.get('global.quickFilter.placeholder'),
    placeholderError: intl.get('global.quickFilter.placeholderError'),
    results: intl.get('global.quickFilter.results'),
  },
});

export const getQueryBuilderDictionary = (
  facetResolver: (key: string) => React.ReactNode,
  savedSets?: IUserSetOutput[],
  alias?: IUserSetOutputAlias[],
): QueryBuilderDict => ({
  queryBuilderHeader: {
    modal: {
      edit: {
        title: intl.get('components.querybuilder.header.modal.edit.title'),
        okText: intl.get('components.querybuilder.header.modal.edit.okText'),
        cancelText: intl.get('components.querybuilder.header.modal.edit.cancelText'),
        content: '',
        input: {
          label: intl.get('components.querybuilder.header.modal.edit.input.label'),
          placeholder: intl.get('components.querybuilder.header.modal.edit.input.placeholder'),
          maximumLength: intl.get('components.querybuilder.header.modal.edit.input.maximumLength'),
        },
      },
      saveThisFilter: intl.get('components.querybuilder.header.modal.saveThisFilter'),
      confirmUnsaved: {
        title: intl.get('components.querybuilder.header.modal.confirmUnsaved.title'),
        openSavedFilter: {
          okText: intl.get(
            'components.querybuilder.header.modal.confirmUnsaved.openSavedFilter.okText',
          ),
          cancelText: intl.get(
            'components.querybuilder.header.modal.confirmUnsaved.openSavedFilter.cancelText',
          ),
          content: intl.get(
            'components.querybuilder.header.modal.confirmUnsaved.openSavedFilter.content',
          ),
        },
        createNewFilter: {
          okText: intl.get(
            'components.querybuilder.header.modal.confirmUnsaved.createNewFilter.okText',
          ),
          cancelText: intl.get(
            'components.querybuilder.header.modal.confirmUnsaved.createNewFilter.cancelText',
          ),
          content: intl.get(
            'components.querybuilder.header.modal.confirmUnsaved.createNewFilter.content',
          ),
        },
      },
    },
    popupConfirm: {
      delete: {
        title: intl.get('components.querybuilder.header.popupConfirm.delete.title'),
        okText: intl.get('components.querybuilder.header.popupConfirm.delete.okText'),
        cancelText: intl.get('components.querybuilder.header.popupConfirm.delete.cancelText'),
        content: intl.get('components.querybuilder.header.popupConfirm.delete.content'),
      },
    },
    tooltips: {
      newQueryBuilder: intl.get('components.querybuilder.header.tooltips.newQueryBuilder'),
      save: intl.get('components.querybuilder.header.tooltips.save'),
      saveChanges: intl.get('components.querybuilder.header.tooltips.saveChanges'),
      saveDisabled: intl.get('components.querybuilder.header.tooltips.saveDisabled'),
      delete: intl.get('components.querybuilder.header.tooltips.delete'),
      duplicateQueryBuilder: intl.get(
        'components.querybuilder.header.tooltips.duplicateQueryBuilder',
      ),
      share: intl.get('components.querybuilder.header.tooltips.share'),
      shareDisabled: intl.get('components.querybuilder.header.tooltips.shareDisabled'),
      setAsDefaultFilter: intl.get('components.querybuilder.header.tooltips.setAsDefaultFilter'),
      unsetDefaultFilter: intl.get('components.querybuilder.header.tooltips.unsetDefaultFilter'),
      undoChanges: intl.get('components.querybuilder.header.tooltips.undoChanges'),
      noSavedFilters: intl.get('components.querybuilder.header.tooltips.noSavedFilters'),
    },
    myFiltersDropdown: {
      title: intl.get('components.querybuilder.header.myFiltersDropdown.title'),
      manageMyFilter: intl.get('components.querybuilder.header.myFiltersDropdown.manageMyFilter'),
    },
    duplicateFilterTitleSuffix: intl.get(
      'components.querybuilder.header.duplicateFilterTitleSuffix',
    ),
  },
  query: {
    combine: {
      and: intl.get('components.querybuilder.query.combine.and'),
      or: intl.get('components.querybuilder.query.combine.or'),
    },
    noQuery: intl.get('components.querybuilder.query.noQuery'),
    facet: facetResolver,
    setNameResolver: (setId: string) => {
      const set = savedSets?.find((set) => set.id === setId.replace(SET_ID_PREFIX, ''));
      if (set && set.tag) {
        return set.tag;
      }
      const aliasSetId = alias?.find((a) => a.setId === setId);
      if (aliasSetId) {
        return aliasSetId.alias;
      }

      return setId;
    },
    facetValueMapping: {
      variant_external_reference: {
        DBSNP: intl.get('screen.variants.table.dbsnp'),
        Clinvar: intl.get('filters.group.clinvar.clin_sig'),
      },
      'genes.consequences.predictions.sift_pred': {
        T: intl.get('facets.options.genes__consequences__predictions__sift_pred.T'),
        D: intl.get('facets.options.genes__consequences__predictions__sift_pred.D'),
      },
      'genes.consequences.predictions.polyphen2_hvar_pred': {
        B: intl.get('facets.options.genes__consequences__predictions__polyphen2_hvar_pred.B'),
        D: intl.get('facets.options.genes__consequences__predictions__polyphen2_hvar_pred.D'),
        P: intl.get('facets.options.genes__consequences__predictions__polyphen2_hvar_pred.P'),
      },
      'genes.consequences.predictions.fathmm_pred': {
        T: intl.get('facets.options.genes__consequences__predictions__fathmm_pred.T'),
        D: intl.get('facets.options.genes__consequences__predictions__fathmm_pred.D'),
      },
      'genes.consequences.predictions.lrt_pred': {
        N: intl.get('facets.options.genes__consequences__predictions__lrt_pred.N'),
        D: intl.get('facets.options.genes__consequences__predictions__lrt_pred.D'),
        U: intl.get('facets.options.genes__consequences__predictions__lrt_pred.U'),
      },
      down_syndrome_status: {
        D21: intl.get('facets.options.D21'),
        T21: intl.get('facets.options.T21'),
      },
      'studies.zygosity': {
        HET: intl.get('facets.options.studies__zygosity.HET'),
        WT: intl.get('facets.options.studies__zygosity.WT'),
        HOM: intl.get('facets.options.studies__zygosity.HOM'),
        UNK: intl.get('facets.options.studies__zygosity.UNK'),
      },
      domain: {
        CANCER: intl.get('facets.options.domain.CANCER'),
        BIRTHDEFECT: intl.get('facets.options.domain.BIRTHDEFECT'),
        CANCERANDBIRTHDEFECT: intl.get('facets.options.domain.CANCERANDBIRTHDEFECT'),
      },
      'study.domain': {
        CANCER: intl.get('facets.options.study__domain.CANCER'),
        BIRTHDEFECT: intl.get('facets.options.study__domain.BIRTHDEFECT'),
        CANCERANDBIRTHDEFECT: intl.get('facets.options.study__domain.CANCERANDBIRTHDEFECT'),
      },
    },
  },
  actions: {
    new: intl.get('components.querybuilder.actions.new'),
    addQuery: intl.get('components.querybuilder.actions.addQuery'),
    compare: intl.get('components.querybuilder.actions.compare'),
    compareLessTooltips: intl.get('components.querybuilder.actions.compareLessTooltips'),
    compareGreaterTooltips: intl.get('components.querybuilder.actions.compareGreaterTooltips'),
    combine: intl.get('components.querybuilder.actions.combine'),
    labels: intl.get('components.querybuilder.actions.labels'),
    changeOperatorTo: intl.get('components.querybuilder.actions.changeOperatorTo'),
    delete: {
      title: intl.get('components.querybuilder.actions.delete.title'),
      cancel: intl.get('components.querybuilder.actions.delete.cancel'),
      confirm: intl.get('components.querybuilder.actions.delete.confirm'),
    },
    clear: {
      title: intl.get('components.querybuilder.actions.clear.title'),
      cancel: intl.get('components.querybuilder.actions.clear.cancel'),
      confirm: intl.get('components.querybuilder.actions.clear.confirm'),
      buttonTitle: intl.get('components.querybuilder.actions.clear.buttonTitle'),
      description: intl.get('components.querybuilder.actions.clear.description'),
    },
  },
});

// ADD intl trad
export const getFacetsDictionary = () => ({
  imaging_sequence_types: 'Sequence Type',
  imaging_techniques: 'Technique',
  imaging: {
    modality: 'Image Modality',
    info_body_part_examined: 'Body Part Examined',
    device: {
      magnetic_field_strength: 'Magnetic Field Strength',
      manufacturer: 'Device Manufacturer',
      model_name: 'Device Model',
    },
  },
  study: {
    study_name: 'Study Name',
    study_code: 'Study Code',
    external_id: 'dbGaP Accession Number',
  },
  studies: {
    study_code: 'Study Code',
    zygosity: 'Zygosity',
    transmission: 'Transmission',
  },
  start: 'Position',
  acl: 'ACL',
  sequencing_experiment: {
    experiment_strategy: 'Experimental Strategy',
    platform: 'Platform',
    instrument_model: 'Instrument Model',
    library_strand: 'Library Strand',
    is_paired_end: 'Is Paired End',
  },
  transmissions: 'Transmission',
  controlled_access: 'Access',
  is_harmonized: 'Harmonized Data',
  is_proband: 'Proband',
  variant_class: 'Variant Type',
  diagnosis: {
    affected_status: 'Clinical Status',
    age_at_event_days: 'Age at Diagnosis (days)',
    mondo_display_term: 'Diagnosis (MONDO)',
    ncit_display_term: 'Diagnosis (NCIT)',
    source_text: 'Diagnosis (Source Text)',
    source_text_tumor_location: 'Tumor Location (Source Text)',
  },
  mondo: {
    name: 'Diagnosis (MONDO)',
  },
  outcomes: {
    vital_status: 'Vital Status',
    age_at_event_days: {
      value: 'Age at Vital Status (days)',
    },
  },
  phenotype: {
    age_at_event_days: 'Age at Observed Phenotype (days)',
    hpo_phenotype_not_observed: 'Not Observed Phenotype (HPO)',
    source_text: 'Observed Phenotype (Source Text)',
  },
  observed_phenotype: {
    name: 'Observed Phenotype (HPO)',
  },
  family_type: 'Family Composition',
  age_at_biospecimen_collection: 'Age at Biospec. Collection (days)',
  status: 'Sample Availability',
  collection_ncit_anatomy_site: 'Anatomical Site (NCIT)',
  collection_anatomy_site: 'Anatomical Site (Source Text)',
  collection_method_of_sample_procurement: 'Method of Sample Procurement',
  dbgap_consent_code: 'dbGaP Consent Code',
  ncit_id_tissue_type: 'Tissue Type (NCIT)',
  tissue_type_source_text: 'Tissue Type (Source Text)',
  diagnoses: {
    age_at_event: {
      value: 'Age at Histological Diagnosis (days)',
    },
    mondo_display_term: 'Histological Diagnosis (MONDO)',
    ncit_display_term: 'Histological Diagnosis (NCIT)',
    source_text: 'Histological Diagnosis (Source Text)',
    source_text_tumor_location: 'Tumor Location (Source Text)',
    source_text_tumor_descriptor: 'Tumor Descriptor (Source Text)',
  },
  clinvar: {
    clin_sig: 'ClinVar',
  },
  consequences: {
    consequences: 'Consequence',
    biotype: 'Gene Type',
    vep_impact: 'VEP',
    predictions: {
      sift_pred: 'SIFT',
      polyphen2_hvar_pred: 'PolyPhen-2 HVAR',
      fathmm_pred: 'FATHMM',
      cadd_rankscore: 'CADD',
      lrt_pred: 'LRT',
      revel_rankscore: 'REVEL',
      dann_rankscore: 'DANN',
    },
  },
  cmc: {
    sample_mutated: 'COSMIC CMC',
    sample_ratio: 'COSMIC CMC (Ratio)',
    tier: 'COSMIC CMC Tier',
  },
  genes: {
    consequences: {
      consequence: 'Consequence',
      vep_impact: 'VEP',
      predictions: {
        cadd_score: 'CADD (Raw)',
        cadd_phred: 'CADD (Phred)',
        dann_score: 'DANN',
        fathmm_pred: 'FATHMM',
        lrt_pred: 'LRT',
        polyphen2_hvar_pred: 'PolyPhen-2 HVAR',
        revel_score: 'REVEL',
        sift_pred: 'SIFT',
      },
    },
    biotype: 'Gene Type',
    gnomad: {
      pli: 'gnomAD pLI',
      loeuf: 'gnomAD LOEUF',
    },
    spliceai: {
      ds: 'SpliceAI',
    },
    hpo: {
      hpo_term_label: 'HPO',
    },
    orphanet: {
      panel: 'ORPHANET',
    },
    omim: {
      name: 'OMIM',
    },
    ddd: {
      disease_name: 'DDD',
    },
    cosmic: {
      tumour_types_germline: 'COSMIC',
    },
  },
  external_frequencies: {
    gnomad_genomes_2_1_1: {
      af: 'gnomAD Genome 2.1.1',
    },
    gnomad_genomes_3: {
      af: 'gnomAD Genome 3.1.2',
    },
    gnomad_exomes_2_1_1: {
      af: 'gnomAD Exome 2.1.1',
    },
    topmed_bravo: {
      af: 'TopMed',
    },
    thousand_genomes: {
      af: '1000 Genomes',
    },
  },
  internal_frequencies: {
    total: {
      af: 'KF Allele Frequency',
    },
  },
  frequencies: {
    internal: {
      upper_bound_kf: {
        af: 'KF Allele Frequency',
      },
    },
    gnomad_genomes_2_1: {
      af: 'gnomAD Genome 2.1',
    },
    gnomad_genomes_3_0: {
      af: 'gnomAD Genome 3.0',
    },
    gnomad_genomes_3_1_1: {
      af: 'gnomAD Genome 3.1',
    },
    gnomad_exomes_2_1: {
      af: 'gnomAD Exome 2.1',
    },
    topmed: {
      af: 'TopMed',
    },
    one_thousand_genomes: {
      af: '1000 Genomes',
    },
  },
  has_matched_normal_sample: 'Paired Normal Sample',
  tooltips: {
    genes: {
      hpo: {
        hpo_term_label: 'Human Phenotype Ontology',
      },
      orphanet: {
        panel: 'ORPHANET',
      },
      omim: {
        name: 'Online Mendelian Inheritance in Man ',
      },
      ddd: {
        disease_name: 'Deciphering Developmental Disorders',
      },
      cosmic: {
        tumour_types_germline: 'Catalogue Of Somatic Mutations In Cancer',
      },
      consequences: {
        vep_impact: 'Ensembl Variant Effect Predictor',
        predictions: {
          cadd_score: 'Combined Annotation Dependent Depletion',
          cadd_phred: 'Combined Annotation Dependent Depletion PHRED',
          dann_score: 'Deleterious Annotation of genetic variants using Neural Networks',
          fathmm_pred: 'Functional Analysis Through Hidden Markov Models',
          lrt_pred: 'Likelihood Ratio Test',
          polyphen2_hvar_pred: 'Polymorphism Phenotyping v2 HumVar',
          revel_score: 'Rare Exome Variant Ensemble Learner',
          sift_pred: 'Sorting Intolerant From Tolerant',
        },
      },
    },
    cmc: {
      sample_mutated: 'Number of samples in COSMIC with this mutation',
      sample_ratio:
        'Ratio of samples in COSMIC with this mutation compared to the variant compared to all the samples',
      tier:
        // eslint-disable-next-line max-len
        'Mutation significance. 1 - high significance, 2 - medium significance, 3 - low significance, Other - No predicted significance (other mutations)',
    },
    hotspot: 'Hotspot Cancer',
  },
});

export const getResizableGridDictionary = () => ({
  fileNameTemplate: intl.get('screen.dataExploration.tabs.summary.download.fileNameTemplate'),
  fileNameDateFormat: intl.get('screen.dataExploration.tabs.summary.download.fileNameDateFormat'),
  download: intl.get('screen.dataExploration.tabs.summary.download.download'),
  data: intl.get('screen.dataExploration.tabs.summary.download.data'),
  svg: intl.get('screen.dataExploration.tabs.summary.download.svg'),
  png: intl.get('screen.dataExploration.tabs.summary.download.png'),
});
