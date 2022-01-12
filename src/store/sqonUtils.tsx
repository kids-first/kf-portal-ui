import { Sqon, SqonFilters } from 'store/sqon';

const isParticipantField = (field: string) => field.startsWith('participants.');

export const shapeFileTypeSqonFiltersForParticipantType = (fileCentricSqon: Sqon) => {
  const originalContent = fileCentricSqon.content as SqonFilters[];

  return originalContent.reduce((acc: SqonFilters[], currentSqonFilter: SqonFilters) => {
    const originalField = currentSqonFilter.content.field;
    const originalValue = currentSqonFilter.content.value;

    const newField = isParticipantField(originalField)
      ? originalField.replace('participants.', '')
      : `files.${originalField}`;

    const shallowCopyOfValue = Array.isArray(originalValue) ? [...originalValue] : originalValue;

    return [
      ...acc,
      { op: currentSqonFilter.op, content: { field: newField, value: shallowCopyOfValue } },
    ];
  }, []);
};

export const addFilterToSQON = (originalSqon: Sqon, field: string, values: string[]) => {
  const newContent = [
    ...originalSqon.content,
    { content: { field: field, value: values }, op: 'in' },
  ];
  return { ...originalSqon, ...{ content: newContent } };
};
