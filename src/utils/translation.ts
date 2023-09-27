import intl from 'react-intl-universal';
import { IDictionary as FiltersDict } from '@ferlab/ui/core/components/filters/types';
import { IProTableDictionary } from '@ferlab/ui/core/components/ProTable/types';
import { IDictionary as QueryBuilderDict } from '@ferlab/ui/core/components/QueryBuilder/types';
import { SET_ID_PREFIX } from '@ferlab/ui/core/data/sqon/types';

import { IUserSetOutput } from 'services/api/savedSet/models';

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
    results: intl.get('global.proTable.results'),
    noResults: intl.get('global.proTable.noResults'),
    of: intl.get('global.proTable.of'),
    selected: intl.get('global.proTable.selected'),
    selectedPlural: intl.get('global.proTable.selectedPlural'),
    selectAllResults: 'Select all results',
    clear: 'Clear',
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
});

export const getQueryBuilderDictionary = (
  facetResolver: (key: string) => React.ReactNode,
  savedSets?: IUserSetOutput[],
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
      delete: intl.get('components.querybuilder.header.tooltips.delete'),
      duplicateQueryBuilder: intl.get(
        'components.querybuilder.header.tooltips.duplicateQueryBuilder',
      ),
      share: intl.get('components.querybuilder.header.tooltips.share'),
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
      return set ? set.tag : setId;
    },
    facetValueMapping: {
      variant_external_reference: {
        DBSNP: intl.get('screen.variants.table.dbsnp'),
        Clinvar: intl.get('filters.group.clinvar.clin_sig'),
      },
      'consequences.predictions.sift_pred': {
        T: intl.get('facets.options.consequences__predictions__sift_pred.T'),
        D: intl.get('facets.options.consequences__predictions__sift_pred.D'),
      },
      'consequences.predictions.polyphen2_hvar_pred': {
        B: intl.get('facets.options.consequences__predictions__polyphen2_hvar_pred.B'),
        D: intl.get('facets.options.consequences__predictions__polyphen2_hvar_pred.D'),
        P: intl.get('facets.options.consequences__predictions__polyphen2_hvar_pred.P'),
      },
      'consequences.predictions.fathmm_pred': {
        T: intl.get('facets.options.consequences__predictions__fathmm_pred.T'),
        D: intl.get('facets.options.consequences__predictions__fathmm_pred.D'),
      },
      'consequences.predictions.lrt_pred': {
        N: intl.get('facets.options.consequences__predictions__lrt_pred.N'),
        D: intl.get('facets.options.consequences__predictions__lrt_pred.D'),
        U: intl.get('facets.options.consequences__predictions__lrt_pred.U'),
      },
      down_syndrome_status: {
        D21: intl.get('facets.options.D21'),
        T21: intl.get('facets.options.T21'),
      },
      zygosity: {
        HET: intl.get('facets.options.zygosity.HET'),
        WT: intl.get('facets.options.zygosity.WT'),
        HOM: intl.get('facets.options.zygosity.HOM'),
        UNK: intl.get('facets.options.zygosity.UNK'),
      },
      domain: {
        CANCER: intl.get('facets.options.domain.CANCER'),
        BIRTHDEFECT: intl.get('facets.options.domain.BIRTHDEFECT'), 
        CANCERANDBIRTHDEFECT: intl.get('facets.options.domain.CANCERANDBIRTHDEFECT'), 
      },
    },
  },
  actions: {
    new: intl.get('components.querybuilder.actions.new'),
    addQuery: intl.get('components.querybuilder.actions.addQuery'),
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
  },
  transmissions: 'Transmission',
  controlled_access: 'Access',
  is_harmonized: 'Harmonized Data',
  is_proband: 'Proband',
  variant_class: 'Variant Type',
  diagnosis: {
    affected_status: 'Clinical Status',
    age_at_event_days: 'Age at Diagnosis',
    mondo_id_diagnosis: 'Diagnosis (MONDO)',
    ncit_id_diagnosis: 'Diagnosis (NCIT)',
    source_text: 'Diagnosis (Source Text)',
    source_text_tumor_location: 'Tumor Location (Source Text)',
  },
  outcomes: {
    vital_status: 'Vital Status',
    age_at_event_days: {
      value: 'Age at Outcome',
    },
  },
  phenotype: {
    age_at_event_days: 'Age at Observed Phenotype',
    hpo_phenotype_observed: 'Observed Phenotype (HPO)',
    hpo_phenotype_not_observed: 'Not Observed Phenotype (HPO)',
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
  tooltips: {
    consequences: {
      vep_impact: 'Ensembl Variant Effect Predictor',
      predictions: {
        cadd_rankscore: 'Combined Annotation Dependent Depletion',
        dann_rankscore: 'Deleterious Annotation of genetic variants using Neural Networks',
        fathmm_pred: 'Functional Analysis Through Hidden Markov Models',
        lrt_pred: 'Likelihood Ratio Test',
        polyphen2_hvar_pred: 'Polymorphism Phenotyping v2 HumVar',
        revel_rankscore: 'Rare Exome Variant Ensemble Learner',
        sift_pred: 'Sorting Intolerant From Tolerant',
      },
    },
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
    },
  },
});

export const getResizableGridDictionary = () => ({
  download: {
    fileNameTemplate: intl.get('screen.dataExploration.tabs.summary.download.fileNameTemplate'),
    fileNameDateFormat: intl.get('screen.dataExploration.tabs.summary.download.fileNameDateFormat'),
    download: intl.get('screen.dataExploration.tabs.summary.download.download'),
    data: intl.get('screen.dataExploration.tabs.summary.download.data'),
    svg: intl.get('screen.dataExploration.tabs.summary.download.svg'),
    png: intl.get('screen.dataExploration.tabs.summary.download.png'),
  },
});
