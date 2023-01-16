export enum RemoteComponentList {
  MondoTree = 'mondoTree',
  HPOTree = 'hpoTree',
}

export type initialState = {
  [RemoteComponentList.MondoTree]: {
    [value: string]: any;
  };
  [RemoteComponentList.HPOTree]: {
    [value: string]: any;
  };
};
