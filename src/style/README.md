# Styles and themes

## Strategy

1. Use .less to customize colors and ant design component
2. Export to scss to be use for the main theme and custom components
3. Use css module and scss per components
4. Use scss exported variable for props and inline styling (should be avoid when possible)

Naming convention for colors variable should follow ant design theme implementation

### Motivation

- Access to the theme value in JS
- Access of the theme value in css module + scss
- Compatibility with other projects and component reusability
- Dont force CRA eject

### Structure

```
[project]/src
  |-- theme/                :> Legacy styles
  |-- style/                :> Main style/theme source
    |-- dist/               :> dynamicaly generated files
      |-- themes
        |-- default/        :> default theme, to load in code
          |-- antd.css      :> load in main app, rewrite ant design default
          '-- _colors.scss   :> generated colors from ant design theme in colors.less
    |-- themes/
      |-- default           :> default theme (default could for example point to v1 or v2 etc.)
        |-- antd/           :> not use directly in the code
        | |-- antd.less
        | '-- colors.less
        |-- _colors.scss     :> Ant design colors and site theme colors
        '-- main.scss      :> General style for the site outside ant design component
```

everything in legacy `src/theme/` should go in `src/style/theme/default/main.scss` or `src/style/theme/default/colors.scss`

## Configuration

### Main use

First import ant design overide in the main application file

```javascript
import 'style/dist/themes/default/antd.css';
import 'style/themes/default/main.scss';
```

### Components

1. Create a `[Component].module.scss` file in the same directory
2. Import your style inside your components

```javascript
import style from '[Component].module.scss';
// ...
return () => <div clasName={style.isBeautiful}></div>;
```

3. To use globaly defined theme variable, load theme from `src/style/theme/default/colors.scss` or `src/style/theme/default/main.scss`

```

```

### How to export scss variable to javascript

inside a scss file, use the `export key` to make them available to javascript. Use the same technique as component `.module.scss` import in JS.

e.g.

```scss
:export {
  btnPrimaryBg: $btn-primary-bg;
  btnPrimaryColor: $btn-primary-color;
}
```
