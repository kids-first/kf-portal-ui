import draftVirtualStudySubscriber from './draftVirtualStudy';

export default store => {
  store.subscribe(() => {
    draftVirtualStudySubscriber(store);
  });
};
