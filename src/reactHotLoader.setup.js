import { setConfig, cold } from 'react-hot-loader';

setConfig({
  onComponentRegister: (type, name, file) => {
    return file.indexOf('node_modules') > 0 && cold(type);
  },
  logLevel: 'debug',
});
