import { useCallback, useEffect } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import CavaticaAnalyse from '@ferlab/ui/core/components/Widgets/Cavatica/CavaticaAnalyse';
import {
  CAVATICA_ANALYSE_STATUS,
  PASSPORT_AUTHENTIFICATION_STATUS,
} from '@ferlab/ui/core/components/Widgets/Cavatica/type';
import { BooleanOperators } from '@ferlab/ui/core/data/sqon/operators';
import { ISqonGroupFilter } from '@ferlab/ui/core/data/sqon/types';
import { CAVATICA_FILE_BATCH_SIZE } from 'views/DataExploration/utils/constant';

import { CavaticaApi } from 'services/api/cavatica';
import { ICavaticaCreateProjectBody } from 'services/api/cavatica/models';
import { fetchAllFencesAuthentificationStatus } from 'store/fences/thunks';
import { useCavaticaPassport } from 'store/passport';
import { passportActions } from 'store/passport/slice';
import {
  beginCavaticaAnalyse,
  connectCavaticaPassport,
  createCavaticaProjet,
  startBulkImportJob,
} from 'store/passport/thunks';

interface OwnProps {
  fileIds: string[];
  sqon?: ISqonGroupFilter;
  type?: 'default' | 'primary';
  disabled?: boolean;
}

const CavaticaAnalyzeButton: React.FC<OwnProps> = ({
  fileIds,
  sqon,
  type = 'default',
  disabled = false,
}) => {
  const dispatch = useDispatch();
  const cavatica = useCavaticaPassport();

  const onBeginAnalyse = useCallback(
    () =>
      dispatch(
        beginCavaticaAnalyse({
          sqon: sqon || {
            op: BooleanOperators.and,
            content: [],
          },
          fileIds,
        }),
      ),
    [dispatch, fileIds, sqon],
  );

  useEffect(() => {
    dispatch(fetchAllFencesAuthentificationStatus());
  }, []);

  // If the user is not connected to cavatica
  useEffect(() => {
    if (
      cavatica.authentification.status === PASSPORT_AUTHENTIFICATION_STATUS.connected &&
      cavatica.bulkImportData.status === CAVATICA_ANALYSE_STATUS.pending_analyse
    ) {
      onBeginAnalyse();
    }
  }, [cavatica.authentification.status, cavatica.bulkImportData.status, onBeginAnalyse]);

  return (
    <CavaticaAnalyse
      disabled={disabled}
      type={type}
      handleBeginAnalyse={onBeginAnalyse}
      handleFilesAndFolders={CavaticaApi.listFilesAndFolders}
      cavatica={cavatica}
      loading={cavatica.bulkImportData.loading}
      setCavaticaBulkImportDataStatus={(status: CAVATICA_ANALYSE_STATUS) => {
        dispatch(passportActions.setCavaticaBulkImportDataStatus(status));
      }}
      handleConnection={() => {
        dispatch(connectCavaticaPassport());
      }}
      handleResetErrors={() => {
        dispatch(passportActions.resetCavaticaBillingsGroupError());
        dispatch(passportActions.resetCavaticaProjectsError());
        dispatch(passportActions.setCavaticaBulkImportDataStatus(CAVATICA_ANALYSE_STATUS.unknow));
      }}
      handleCreateProject={(values: ICavaticaCreateProjectBody) => {
        dispatch(
          createCavaticaProjet({
            body: values,
          }),
        );
      }}
      handleImportBulkData={(value) => {
        dispatch(startBulkImportJob(value));
      }}
      dictionary={{
        analyseModal: {
          copyFiles: intl.get(
            'screen.dataExploration.tabs.datafiles.cavatica.analyseModal.copyFiles',
          ),
          copyFilesTo: intl.get(
            'screen.dataExploration.tabs.datafiles.cavatica.analyseModal.copyFilesTo',
          ),
          createProjectToPushFileTo: intl.get(
            'screen.dataExploration.tabs.datafiles.cavatica.analyseModal.createProjectToPushFileTo',
          ),
          newProject: intl.get(
            'screen.dataExploration.tabs.datafiles.cavatica.analyseModal.newProject',
          ),
          title: intl.get('screen.dataExploration.tabs.datafiles.cavatica.analyseInCavatica'),
          youAreAuthorizedToCopy: intl.get(
            'screen.dataExploration.tabs.datafiles.cavatica.analyseModal.youAreAuthorizedToCopy',
          ),
          files: intl.get('screen.dataExploration.tabs.datafiles.cavatica.analyseModal.files'),
          ofFiles: intl.get('screen.dataExploration.tabs.datafiles.cavatica.analyseModal.ofFiles'),
        },
        billingGroupsErrorModal: {
          description: intl.get('api.cavatica.error.projects.fetch'),
          title: intl.get('api.cavatica.error.title'),
        },
        buttonText: intl.get('screen.dataExploration.tabs.datafiles.cavatica.analyseInCavatica'),
        connectionRequiredModal: {
          description: intl.get(
            'screen.dataExploration.tabs.datafiles.cavatica.authWarning.description',
          ),
          okText: intl.get('screen.dataExploration.tabs.datafiles.cavatica.authWarning.connect'),
          title: intl.get('screen.dataExploration.tabs.datafiles.cavatica.authWarning.title'),
        },
        fetchErrorModal: {
          description: intl.get('api.cavatica.error.bulk.fetchfiles'),
          title: intl.get('api.cavatica.error.title'),
        },
        createProjectModal: {
          title: intl.get('screen.dashboard.cards.cavatica.newProject'),
          requiredField: intl.get('global.forms.errors.requiredField'),
          projectName: {
            label: 'Project name',
            placeholder: 'e.g. KF-NBL Neuroblastoma Aligned Reads',
          },
          billingGroup: {
            label: intl.get('screen.dashboard.cards.cavatica.billingGroups.label'),
            empty: intl.get('screen.dashboard.cards.cavatica.billingGroups.empty'),
          },
          okText: intl.get('screen.dashboard.cards.cavatica.createProject'),
          cancelText: intl.get('screen.dashboard.cards.cavatica.cancelText'),
        },
        projectCreateErrorModal: {
          description: intl.get('api.cavatica.error.projects.fetch'),
          title: intl.get('api.cavatica.error.title'),
        },
        projectFetchErrorModal: {
          description: intl.get('api.cavatica.error.projects.fetch'),
          title: intl.get('api.cavatica.error.title'),
        },
        unauthorizedModal: {
          description: intl.get('api.cavatica.error.fileAuth.description'),
          title: intl.get('api.cavatica.error.fileAuth.title'),
        },
        uploadLimitReachedModalError: {
          description: intl.getHTML(
            'screen.dataExploration.tabs.datafiles.cavatica.bulkImportLimit.description',
            { limit: CAVATICA_FILE_BATCH_SIZE },
          ),
          okText: 'OK',
          title: intl.get('screen.dataExploration.tabs.datafiles.cavatica.bulkImportLimit.title'),
        },
      }}
    />
  );
};

export default CavaticaAnalyzeButton;
