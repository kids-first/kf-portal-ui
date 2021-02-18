import { apiInitialized } from '../../services/api';
import { arrangerUpdateApiRoot } from 'common/injectGlobals';

export const fetchVariantDBStats = async () =>
  // @ts-ignore
  await apiInitialized({
    method: 'GET',
    arrangerRoot: arrangerUpdateApiRoot,
    endpoint: 'variantDbStats',
  });
