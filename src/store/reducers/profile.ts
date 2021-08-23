import { ProfileActions, ProfileActionTypes, ProfileState } from '../profileTypes';
import { LogoutAction, UserActions } from '../userTypes';

const initialState: ProfileState = {
  isProfileLoading: false,
  profile: {},
  errorProfile: null,
  isTogglingProfileStatus: false,
  isTogglingProfileStatusInError: null,
  isProfileUpdating: false,
};

export default (state = initialState, action: ProfileActionTypes | LogoutAction): ProfileState => {
  switch (action.type) {
    case ProfileActions.requestProfile:
      return { ...state, isProfileLoading: true };
    case ProfileActions.receiveProfile:
      return { ...state, profile: action.payload, isProfileLoading: false };
    case ProfileActions.failureProfile:
      return { ...state, errorProfile: action.payload, isProfileLoading: false };
    case ProfileActions.requestUpdateProfile:
      return { ...state, isProfileUpdating: true };
    case ProfileActions.failureUpdateProfile:
      return { ...state, errorProfile: action.payload, isProfileLoading: false };
    case ProfileActions.updateProfileSuccess:
      return { ...state, profile: action.payload, isProfileUpdating: false };
    case UserActions.logout:
    case ProfileActions.deleteProfile:
      return { ...state, profile: {} };
    case ProfileActions.requestIsActiveToggle:
    case ProfileActions.requestIsPublicToggle:
      return { ...state, isTogglingProfileStatus: true };
    case ProfileActions.receiveIsPublicToggle: {
      return {
        ...state,
        isTogglingProfileStatus: false,
        profile: {
          ...state.profile,
          isPublic: !state.profile!.isPublic,
        },
      };
    }
    case ProfileActions.failureIsActiveToggle:
    case ProfileActions.failureIsPublicToggle:
      return {
        ...state,
        isTogglingProfileStatus: false,
        isTogglingProfileStatusInError: action.payload,
      };
    case ProfileActions.receiveIsActiveToggle: {
      return {
        ...state,
        isTogglingProfileStatus: false,
        profile: { ...state.profile, isActive: !state.profile.isActive },
      };
    }
    case ProfileActions.cleanProfileErrors:
      return {
        ...state,
        errorProfile: null,
        isTogglingProfileStatusInError: null,
      };
    default:
      return state;
  }
};
