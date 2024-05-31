# Styling Kids First Portal

## Strategy

Style is modified in two ways

1. Globally antd theme in src/style/dist/antd-kf-theme.css
   styles that should follow a global guideline; colors, fonts, section dimemsion
2. Per modules/react component with css-modules
   What require tweeks for that specific component should be styled in css-modules

## Deprecated

### scss

- Some component use scss, we should migrate to default antd theme or css-modules
- What is under `src/theme` should be migrated
