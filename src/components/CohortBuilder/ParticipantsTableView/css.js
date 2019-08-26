import { css } from 'emotion';

export const rowCss = css({
  display: 'flex',
  flexWrap: 'nowrap',
  alignItems: 'flex-start',
  alignContent: 'stretch',
});

export const rooTable = css({
  '.nbFilesLink img': {
    top: '2px',
    position: 'relative',
  },
  'div.rt-noData': {
    display: 'none !important',
  },
});
