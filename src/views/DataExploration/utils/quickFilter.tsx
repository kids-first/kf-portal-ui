import { ExperimentOutlined, FileTextOutlined, UserOutlined } from '@ant-design/icons';
import { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';
import { VisualType } from '@ferlab/ui/core/components/filters/types';
import { CheckboxQFOption } from '@ferlab/ui/core/components/SidebarMenu/QuickFilter';
import {
  ISyntheticSqon,
  IValueFilter,
  TSyntheticSqonContentValue,
} from '@ferlab/ui/core/data/sqon/types';
import { INDEXES } from 'graphql/constants';
import { cloneDeep } from 'lodash';

export const getFieldCategoryIcon = (facetKey: string, props: AntdIconProps): React.ReactNode => {
  if (facetKey.startsWith('files__biospecimens__')) {
    return <ExperimentOutlined {...props} />;
  }
  if (facetKey.startsWith('files__')) {
    return <FileTextOutlined {...props} />;
  }

  return <UserOutlined {...props} />;
};

export const getIndexFromQFValueFacet = (facetKey: string): INDEXES => {
  if (facetKey.startsWith('files__biospecimens__')) return INDEXES.BIOSPECIMEN;
  else if (facetKey.startsWith('files__')) return INDEXES.FILE;
  else return INDEXES.PARTICIPANT;
};

export const getFieldWithoutPrefix = (facetKey: string): string => {
  if (facetKey.startsWith('files__biospecimens__')) return facetKey.slice(21);
  else if (facetKey.startsWith('files__')) return facetKey.slice(7);
  else return facetKey;
};

export const getFieldWithPrefixParticipant = (index: string, field: string): string => {
  switch (index) {
    case INDEXES.BIOSPECIMEN:
      return `files.biospecimens.${field}`;
    case INDEXES.FILE:
      return `files.${field}`;
    default:
      return field;
  }
};

export const getFieldWithPrefixBiospecimen = (index: string, field: string): string => {
  switch (index) {
    case INDEXES.PARTICIPANT:
      return `participant.${field}`;
    case INDEXES.FILE:
      return `files.${field}`;
    default:
      return field;
  }
};

export const getFieldWithPrefixFile = (index: string, field: string): string => {
  switch (index) {
    case INDEXES.PARTICIPANT:
      return `participants.${field}`;
    case INDEXES.BIOSPECIMEN:
      return `participants.biospecimens.${field}`;
    default:
      return field;
  }
};

export const getFieldWithPrefixUnderscore = (index: string, field: string): string => {
  switch (index) {
    case INDEXES.BIOSPECIMEN:
      return `files__biospecimens__${field}`;
    case INDEXES.FILE:
      return `files__${field}`;
    default:
      return field;
  }
};

export const getSqonForQuickFilterFacetValue = (activeQuery: ISyntheticSqon): ISyntheticSqon => {
  const activeQueryUpdated = cloneDeep(activeQuery);
  activeQueryUpdated.content.forEach((sqonContent: TSyntheticSqonContentValue) => {
    const originalIndex = (sqonContent as IValueFilter).content.index;
    const originalField = (sqonContent as IValueFilter).content.field;
    const fieldPrefixed = originalIndex
      ? getFieldWithPrefixParticipant(originalIndex, originalField)
      : originalField;
    (sqonContent as IValueFilter).content.index = INDEXES.PARTICIPANT;
    (sqonContent as IValueFilter).content.field = fieldPrefixed;
  });
  return activeQueryUpdated;
};

export const getSqonForQuickFilterFacetView = (
  activeQuery: ISyntheticSqon,
  index: string,
): ISyntheticSqon => {
  const activeQueryUpdated = cloneDeep(activeQuery);
  activeQueryUpdated.content.forEach((sqonContent: TSyntheticSqonContentValue) => {
    const originalIndex = (sqonContent as IValueFilter).content.index;
    const originalField = (sqonContent as IValueFilter).content.field;
    let fieldPrefixed = originalField;
    if (index === INDEXES.PARTICIPANT && originalIndex)
      fieldPrefixed = getFieldWithPrefixParticipant(originalIndex, originalField);
    else if (index === INDEXES.BIOSPECIMEN && originalIndex)
      fieldPrefixed = getFieldWithPrefixBiospecimen(originalIndex, originalField);
    else if (index === INDEXES.FILE && originalIndex)
      fieldPrefixed = getFieldWithPrefixFile(originalIndex, originalField);
    (sqonContent as IValueFilter).content.index = INDEXES.PARTICIPANT;
    (sqonContent as IValueFilter).content.field = fieldPrefixed;
  });
  return activeQueryUpdated;
};

export const getSelectedOptionsByQuery = (activeQuery: ISyntheticSqon) => {
  const selectedOptions: CheckboxQFOption[] = [];

  activeQuery.content.forEach((sqonContent: TSyntheticSqonContentValue) => {
    const originalIndex = (sqonContent as IValueFilter).content.index;
    const originalField = (sqonContent as IValueFilter).content.field;
    const fieldPrefixed = originalIndex
      ? getFieldWithPrefixUnderscore(originalIndex, originalField)
      : originalField;

    (sqonContent as IValueFilter).content.value.forEach((v) => {
      if (typeof v === 'string') {
        const option: CheckboxQFOption = {
          key: v,
          label: v,
          type: VisualType.Checkbox,
          index: originalIndex || INDEXES.PARTICIPANT,
          docCount: 0,
          facetKey: fieldPrefixed,
        };
        selectedOptions.push(option);
      }
    });
  });
  return selectedOptions;
};
