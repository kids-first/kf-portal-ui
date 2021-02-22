import { apiInitialized } from '../../services/api';
import { kfArrangerApiRoot } from 'common/injectGlobals';

export const fetchVariantDBStats = async () => {
  // @ts-ignore
  const result = await apiInitialized({
    method: 'GET',
    arrangerRoot: kfArrangerApiRoot,
    endpoint: 'variantDbStats',
  });
  return result._source;
};
