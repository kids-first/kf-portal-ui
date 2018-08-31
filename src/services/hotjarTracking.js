import scriptjs from 'scriptjs';
import urlJoin from 'url-join';
import { hotjarHost, hotjarId } from 'common/injectGlobals';

export const init = () => scriptjs(`${hotjarHost}${hotjarId}.js?sv=6`);
  
