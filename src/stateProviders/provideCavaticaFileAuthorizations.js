import { provideState, update } from 'freactal';
import { flatten } from 'lodash';

export default provideState({
  initialState: props => ({
    //Authorized Files have to be broken down by Fence:
    // {gen3:[], dcf:[]}
    authorizedFiles: {},
    unauthorizedFiles: [],
    fileStudyData: {},
    fileAuthInitialized: false,
  }),
  computed: {
    authorizedFilesCombined: ({ authorizedFiles }) => flatten(Object.values(authorizedFiles)),
  },
  effects: {
    setFileAuthInitialized: update(state => ({ fileAuthInitialized: true })),
    setAuthorizedFiles: update((state, authorizedFiles) => ({ authorizedFiles })),
    setUnauthorizedFiles: update((state, unauthorizedFiles) => ({ unauthorizedFiles })),
    setFileStudyData: update((state, fileStudyData) => ({ fileStudyData })),
  },
});
