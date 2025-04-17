import intl from 'react-intl-universal';
import { TVennChartDictionary } from '@ferlab/ui/core/components/Charts/Venn/utils';
import { INDEXES } from 'graphql/constants';

export const vennDictionary: TVennChartDictionary = {
  query: {
    column: intl.get('screen.analytics.setOperations.venn.query.column'),
    title: intl.get('screen.analytics.setOperations.venn.query.title'),
  },
  set: {
    column: intl.get('screen.analytics.setOperations.venn.set.column'),
    title: intl.get('screen.analytics.setOperations.venn.set.title'),
    footer: intl.get('screen.analytics.setOperations.venn.set.footer'),
    tooltipDataExplo: intl.get('screen.analytics.setOperations.venn.set.tooltipDataExplo'),
    tooltipVariantExplo: intl.get('screen.analytics.setOperations.venn.set.tooltipVariantExplo'),
    max: intl.get('screen.analytics.setOperations.venn.set.max'),
  },
  save: {
    nameTemplate: intl.get('screen.analytics.setOperations.venn.save.nameTemplate'),
    maximumLength: intl.get('components.querybuilder.header.modal.edit.input.maximumLength'),
    permittedCharacters: intl.get('components.savedSets.modal.errors.permittedCharacters'),
    alreadyExist: intl.get('screen.analytics.setOperations.venn.save.alreadyExist'),
    requiredField: intl.get('global.forms.errors.requiredField'),
    titleData: intl.get('screen.analytics.setOperations.venn.save.titleData'),
    titleVariant: intl.get('screen.analytics.setOperations.venn.save.titleVariant'),
    getEntityText: (index: string, entityCount: number) => {
      if (index === INDEXES.BIOSPECIMEN) {
        return intl.get('screen.analytics.setOperations.venn.save.entity.biospecimens', {
          count: entityCount,
        });
      } else if (index === INDEXES.FILE) {
        return intl.get('screen.analytics.setOperations.venn.save.entity.files', {
          count: entityCount,
        });
      } else if (index === INDEXES.VARIANTS) {
        return intl.get('screen.analytics.setOperations.venn.save.entity.variants', {
          count: entityCount,
        });
      } else {
        return intl.get('screen.analytics.setOperations.venn.save.entity.participants', {
          count: entityCount,
        });
      }
    },
    label: intl.get('screen.analytics.setOperations.venn.save.label'),
    checkbox: {
      label: intl.get('screen.analytics.setOperations.venn.save.checkbox.label'),
      tooltips: intl.get('screen.analytics.setOperations.venn.save.checkbox.tooltips'),
    },
    ok: intl.get('screen.analytics.setOperations.venn.save.ok'),
    cancel: intl.get('screen.analytics.setOperations.venn.save.cancel'),
  },
  participants: intl.get('screen.analytics.setOperations.venn.participants'),
  biospecimens: intl.get('screen.analytics.setOperations.venn.biospecimens'),
  files: intl.get('screen.analytics.setOperations.venn.files'),
  count: intl.get('screen.analytics.setOperations.venn.count'),
  filters: {
    compareButton: intl.get('screen.analytics.setOperations.selectSet.compare'),
    compareDisabledTooltip: intl.get(
      'screen.analytics.setOperations.selectSet.compareDisabledTooltip',
    ),
    optionDisabledTooltip: intl.get(
      'screen.analytics.setOperations.selectSet.entityType.disabledTooltip',
    ),
    resetTooltip: intl.get('screen.analytics.setOperations.selectSet.resetTooltip'),
    selectEntity: intl.get('screen.analytics.setOperations.selectSet.entityType.label'),
    selectEntityPlaceholder: intl.get(
      'screen.analytics.setOperations.selectSet.entityType.placeholder',
    ),
    selectSet: intl.get('screen.analytics.setOperations.selectSet.sets.label'),
    selectSetPlaceholder: intl.get('screen.analytics.setOperations.selectSet.sets.placeholder'),
  },
  download: {
    png: intl.get('screen.analytics.setOperations.venn.download.png'),
    fileNameDateFormat: intl.get('screen.analytics.setOperations.venn.download.fileNameDateFormat'),
    fileNameTemplate: intl.get('screen.analytics.setOperations.venn.download.fileNameTemplate'),
  },
};
