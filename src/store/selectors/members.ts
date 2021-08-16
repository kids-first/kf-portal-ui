import { RootState } from '../rootState';

export const selectMemberErrors = (state: RootState) => state.members.errors;
export const selectMembers = (state: RootState) => state.members.members;
export const selectCounts = (state: RootState) => state.members.count;
export const selectIsPending = (state: RootState) => state.members.pending;
export const selectQueryString = (state: RootState) => state.members.queryString;
export const selectCurrentPage = (state: RootState) => state.members.currentPage;
export const selectMembersPerPage = (state: RootState) => state.members.membersPerPage;
export const selectRolesFilter = (state: RootState) => state.members.rolesFilter;
export const selectInterestsFilter = (state: RootState) => state.members.interestsFilter;
export const selectAdminOptionsFilter = (state: RootState) => state.members.adminOptionsFilter;
