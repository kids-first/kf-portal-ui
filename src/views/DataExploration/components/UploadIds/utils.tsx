import { MatchTableItem } from '@ferlab/ui/core/components/UploadIds/types';

export const extractUploadValues = (arr: MatchTableItem[], key: any): string[] =>
  arr.reduce((filtered: string[], o: any) => {
    if (o[key]) filtered.push(o[key]);
    return filtered;
  }, []);
