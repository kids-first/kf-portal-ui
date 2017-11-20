declare namespace NodeJS {
  export interface Global {
    gapi: any;
    log: Function;
    FB: any;
    fbAsyncInit: Function;
    location: any;
  }
}
