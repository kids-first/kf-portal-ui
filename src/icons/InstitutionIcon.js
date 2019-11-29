import React from 'react';

const paddingRight = 8;
export default ({ width = '23px', height = '15px' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1024 1024"
    width={width}
    height={height}
    style={{ verticalAlign: 'middle', fill: 'currentColor', overflow: 'hidden', paddingRight: paddingRight}}
  >
    <path
    d="M902 302h-300v-180c0-36-24-60-60-60h-420c-36 0-60 24-60 60v780c0 18 6 30 18 42s24 18 42 18h780c36 0 60-24 60-60v-540c0-36-24-60-60-60z m-780 60h180V512h-180V362z m0 210h180v132h-180V572z m420 330h-420v-132h180v132h60v-132h180v132z m0-198h-180V572h180v132z m0-192h-180V362h180V512z m0-210h-180v-180h-60v180h-180v-180h420v180z m360 600h-300v-132h120v-60h-120V572h120V512h-120V362h300v540z"
    />
  </svg>
);
