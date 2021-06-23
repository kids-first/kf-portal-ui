import { Sqon, SqonFilters } from 'store/sqon';

const isParticipantField = (field: string) => field.startsWith('participants.');

export const removeSaveSetFilters = (sqonFilters: SqonFilters[]) =>
  sqonFilters.filter((sqonFilter) => {
    const content = sqonFilter.content;
    const value = content.value;
    return Array.isArray(value) || !value.startsWith('set_id:');
  });

export const extractSaveSetIdsFromSqon = (originalSqon: Sqon) => {
  const sqonContent = originalSqon.content as SqonFilters[];
  return sqonContent.reduce((acc: string[], sqonFilter: SqonFilters) => {
    const filterContent = sqonFilter.content;
    const value = filterContent.value;
    if (Array.isArray(value)) {
      return acc;
    } else if (value.startsWith('set_id:')) {
      const setId = value.replace('set_id:', '');
      return [...acc, setId];
    }
    return acc;
  }, []);
};

export const shapeFileTypeSqonFiltersForParticipantType = (fileCentricSqon: Sqon) => {
  const originalContent = fileCentricSqon.content as SqonFilters[];

  const contentWithSaveSetFilteredOut = removeSaveSetFilters(originalContent);

  return contentWithSaveSetFilteredOut.reduce(
    (acc: SqonFilters[], currentSqonFilter: SqonFilters) => {
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
    },
    [],
  );
};

export const addFilterToSQON = (originalSqon: Sqon, field: string, values: string[]) => {
  const newContent = [
    ...originalSqon.content,
    { content: { field: field, value: values }, op: 'in' },
  ];
  return { ...originalSqon, ...{ content: newContent } };
};
