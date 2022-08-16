export const getColumnStateQuery = (index: string) => `
query columnsStateQuery {
  ${index} {
    columnsState {
      state {
        type
        keyField
        defaultSorted {
          id
          desc
        }
        columns {
          field
          accessor
          show
          type
          sortable
          canChangeShow
          query
          jsonPath
        }
      }
    }
  }
}
`;
