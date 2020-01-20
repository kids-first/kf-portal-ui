import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import { generateLabelsFromFormChange } from './utils';
import { isFeatureEnabled } from 'common/featuresToggles';

const isMemberTrackingEnable = isFeatureEnabled('memberPageGaTracking');

export const onClickEditTrack = async () => {
  if (isMemberTrackingEnable) {
    await trackUserInteraction({
      category: TRACKING_EVENTS.categories.user.profileAboutMe,
      action: TRACKING_EVENTS.actions.editOpened,
      label: TRACKING_EVENTS.labels.aboutMeMyProfile,
    });
  }
};

export const onSummitTrack = async (profileBefore, profileAfter) => {
  if (isMemberTrackingEnable) {
    await trackUserInteraction({
      category: TRACKING_EVENTS.categories.user.profileAboutMe,
      action: TRACKING_EVENTS.actions.save,
      label: generateLabelsFromFormChange(profileBefore, profileAfter).join(', '),
    });
  }
};

export const onCancelTrack = async (profileBefore, profileAfter) => {
  if (isMemberTrackingEnable) {
    await trackUserInteraction({
      category: TRACKING_EVENTS.categories.user.profileAboutMe,
      action: TRACKING_EVENTS.actions.save,
      label: generateLabelsFromFormChange(profileBefore, profileAfter).join(', '),
    });
  }
};
