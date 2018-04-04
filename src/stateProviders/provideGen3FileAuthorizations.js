import { provideState, update } from 'freactal';

export default provideState({
  initialState: props => ({
    authorizedFiles: null,
    unauthorizedFiles: null,
    fileStudyData: {},
    fileAuthInitialized: false,
  }),
  effects: {
    setFileAuthInitialized: update(state => ({ fileAuthInitialized: true })),
    setAuthorizedFiles: update((state, authorizedFiles) => ({ authorizedFiles })),
    setUnauthorizedFiles: update((state, unauthorizedFiles) => ({ unauthorizedFiles })),
    setFileStudyData: update((state, fileStudyData) => ({ fileStudyData })),
  },
});
