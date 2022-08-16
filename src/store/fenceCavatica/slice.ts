import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CAVATICA_TYPE, ICavaticaProject } from 'services/api/cavatica/models';
import { initialState, TCavaticaProjectWithMembers } from 'store/fenceCavatica/types';
import {
  beginAnalyse,
  createProjet,
  fetchAllBillingGroups,
  fetchAllProjects,
  startBulkImportJob,
} from './thunks';

export const FenceCavaticaState: initialState = {
  isAnalyseModalOpen: false,
  isCreateProjectModalOpen: false,
  isCreatingProject: false,
  isFetchingBillingGroup: false,
  isInitializingAnalyse: false,
  isBulkImportLoading: false,
  isLoading: false,
  beginAnalyseAfterConnection: false,
  bulkImportData: {
    files: [],
    authorizedFiles: [],
  },
  projects: [],
  projectsTree: [],
  billingGroups: [],
  newlyCreatedProject: undefined,
};

const convertProjectToTreeNode = (project: ICavaticaProject) => ({
  ...project,
  pId: 0,
  title: project.name,
  value: project.id,
  type: CAVATICA_TYPE.PROJECT,
});

const sortProjects = (projects: TCavaticaProjectWithMembers[]) =>
  projects.sort((p1, p2) => (new Date(p1.modified_on) < new Date(p2.modified_on) ? 1 : -1));

const fenceCavaticaSlice = createSlice({
  name: 'fenceCavatica',
  initialState: FenceCavaticaState,
  reducers: {
    toggleAnalyseModal: (state, action: PayloadAction<boolean>) => ({
      ...state,
      isAnalyseModalOpen: action.payload,
    }),
    toggleCreateProjectModal: (state, action: PayloadAction<boolean>) => ({
      ...state,
      isCreateModalOpen: action.payload,
    }),
    setBeginAnalyseConnectionFlag: (state) => ({
      ...state,
      beginAnalyseAfterConnection: true,
    }),
    beginCreateProject: (state) => ({
      ...state,
      isAnalyseModalOpen: false,
      isCreateProjectModalOpen: true,
    }),
    cancelCreateProject: (state, action: PayloadAction<boolean>) => ({
      ...state,
      isCreateProjectModalOpen: false,
      isAnalyseModalOpen: action.payload,
    }),
    cancelAnalyse: (state) => ({
      ...state,
      bulkImportData: {
        files: [],
        authorizedFiles: [],
      },
      isAnalyseModalOpen: false,
    }),
  },
  extraReducers: (builder) => {
    // FETCH PROJECTS
    builder.addCase(fetchAllProjects.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchAllProjects.fulfilled, (state, action) => {
      const sortedProjectList = sortProjects(action.payload);
      state.isLoading = false;
      state.projects = sortedProjectList;
      state.projectsTree = sortedProjectList.map((project) => convertProjectToTreeNode(project));
    });
    builder.addCase(fetchAllProjects.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
    // FETCH BILLING GROUPS
    builder.addCase(fetchAllBillingGroups.pending, (state, action) => {
      state.isFetchingBillingGroup = true;
    });
    builder.addCase(fetchAllBillingGroups.fulfilled, (state, action) => {
      state.isFetchingBillingGroup = false;
      state.billingGroups = action.payload;
    });
    builder.addCase(fetchAllBillingGroups.rejected, (state, action) => {
      state.isFetchingBillingGroup = false;
      state.error = action.payload;
    });
    // BEGIN ANALYSE
    builder.addCase(beginAnalyse.pending, (state, action) => {
      state.isInitializingAnalyse = true;
      state.beginAnalyseAfterConnection = false;
      state.newlyCreatedProject = undefined;
    });
    builder.addCase(beginAnalyse.fulfilled, (state, action) => {
      state.isInitializingAnalyse = false;
      state.isAnalyseModalOpen = true;
      state.bulkImportData = action.payload;
    });
    builder.addCase(beginAnalyse.rejected, (state, action) => {
      state.isInitializingAnalyse = false;
      state.error = action.payload;
    });
    // BULK IMPORT
    builder.addCase(startBulkImportJob.pending, (state, action) => {
      state.isBulkImportLoading = true;
    });
    builder.addCase(startBulkImportJob.fulfilled, (state, action) => {
      state.isBulkImportLoading = false;
      state.isAnalyseModalOpen = false;
    });
    builder.addCase(startBulkImportJob.rejected, (state, action) => {
      state.isBulkImportLoading = false;
      state.error = action.payload;
    });
    // CREATE PROJECT
    builder.addCase(createProjet.pending, (state, action) => {
      state.isCreatingProject = true;
    });
    builder.addCase(createProjet.fulfilled, (state, action) => {
      const newProjectList = [
        ...state.projects,
        {
          ...action.payload.newProject,
          memberCount: 1,
        },
      ];
      const sortedProjectList = sortProjects(newProjectList);

      state.isCreatingProject = false;
      state.isCreateProjectModalOpen = false;
      state.isAnalyseModalOpen = action.payload.isAnalyseModalVisible;
      state.newlyCreatedProject = convertProjectToTreeNode(action.payload.newProject);
      state.projects = sortedProjectList;
      state.projectsTree = sortedProjectList.map((project) => convertProjectToTreeNode(project));
    });
    builder.addCase(createProjet.rejected, (state, action) => {
      state.isCreatingProject = false;
      state.error = action.payload;
    });
  },
});

export const fenceCavaticaActions = fenceCavaticaSlice.actions;
export default fenceCavaticaSlice.reducer;
