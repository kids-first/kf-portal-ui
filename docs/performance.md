# Performance

## Bundle Optimization

### Lodash

Most lodash function are now available in native JavaScript. These should be preferec

|                                   |                          |      |
| --------------------------------- | ------------------------ | ---: |
| `import { find } from 'lodash';`  | The whole lodash package | 70kb |
| `import find from 'lodash/find';` | Only the find function   |  2kb |

#### Plugins

- [Rewire plugin](https://github.com/osdevisnot/react-app-rewire-contrib/tree/master/packages/react-app-rewire-lodash) for create-react-app

### Antd

#### Components

|                                    |                                |       |
| ---------------------------------- | ------------------------------ | ----: |
| `import { Menu } from 'antd';`     | The whole antd packages        | 489kb |
| `import Menu from 'antd/es/menu';` | Only what is required for Menu | 206kb |

- We can also try the [babel plugin](https://github.com/ant-design/babel-plugin-import)
- How to fix it with [customize-cra for create-react-app](https://github.com/ant-design/ant-design/issues/12011)
- [Github issue with formik-antd](https://github.com/jannikbuschke/formik-antd/issues/63)

#### Image

antd now have svg image for icons. All off them are bundle even if we use a few.

- We can optimize it massively using the [babel-plugin-import](https://github.com/ant-design/babel-plugin-import/issues/271#issuecomment-549653914)
- How to fix it with [customize-cra for create-react-app](https://github.com/ant-design/ant-design/issues/12011)
- [Github issue](https://github.com/ant-design/babel-plugin-import/issues/271)

#### e.g.

First, Install install dependencies to modify create-react-app

`npm i -D react-app-rewired customize-cra`

Second, add an override configuration

> config-overwrites.js

```javascript
const { override, fixBabelImports, addWebpackAlias } = require('customize-cra');
const rewireCompressionPlugin = require('react-app-rewire-compression-plugin');
const rewireUglifyjs = require('react-app-rewire-uglifyjs');
const path = require('path');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css',
  }),
  addWebpackAlias({
    ['@ant-design/icons/lib/dist$']: path.resolve(__dirname, './src/client/icons.js'),
  }),
  rewireUglifyjs,
  rewireCompressionPlugin,
);
```

### Moment.js vs Day.js

Moment.js is bigger and slower than day.js (1). We should move to dayjs or at least remove all unused local inside moment.js

|           |       |
| --------- | ----- |
| Moment.js | 329kb |
| Day.js    | 2.6kb |

#### Plugins

- Remove unneeded locals with [moment-locales-webpack-plugin](https://github.com/iamakulov/moment-locales-webpack-plugin)
- Replace momentjs to dayjs in Antd with [antd-dayjs-webpack-plugin](https://github.com/ant-design/antd-dayjs-webpack-plugin)
  - [Github issue1](https://github.com/iamkun/dayjs/issues/529)
  - [Github issue 2](https://github.com/ant-design/ant-design/issues/15311)
  - Document is also provided on [how to use it with create-react-app](https://ant.design/docs/react/use-with-create-react-app)

#### More information

- [A bit more context](https://medium.com/datadriveninvestor/https-medium-com-sabesan96-why-you-should-choose-day-js-instead-of-moment-js-9cf7bb274bbd)
- [Discussion to replace it in antd](https://github.com/iamkun/dayjs/issues/529)
- (1) [You don't need momentjs](https://github.com/you-dont-need/You-Dont-Need-Momentjs)

### Long Term strategy

Components that should be replace or remove

- kfarranger components
- jsonpath
- momentjs (see above)
- react-social-icon
- form
