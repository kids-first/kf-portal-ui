import { useEffect } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import AuthorizedStudiesWidget, {
  IFenceService,
} from '@ferlab/ui/core/components/AuthorizedStudies';
import { FENCE_AUHTENTIFICATION_STATUS } from '@ferlab/ui/core/components/AuthorizedStudies';
import { INDEXES } from 'graphql/constants';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';

import { FENCE_NAMES } from 'common/fenceTypes';
import KidsFirstLoginIcon from 'components/Icons/KidsFirstLoginIcon';
import NciIcon from 'components/Icons/NciIcon';
import { useFenceAuthentification, useFencesAuthorizedStudies } from 'store/fences';
import {
  fenceDisconnection,
  fenceOpenAuhentificationTab,
  fetchAuthorizedStudies,
} from 'store/fences/thunks';
import { SUPPORT_EMAIL } from 'store/report/thunks';
import { STATIC_ROUTES } from 'utils/routes';

import { DashboardCardProps } from '..';

const AuthorizedStudies = ({ id, className = '' }: DashboardCardProps) => {
  const dispatch = useDispatch();
  const gen3 = useFenceAuthentification(FENCE_NAMES.gen3);
  const dcf = useFenceAuthentification(FENCE_NAMES.dcf);
  const fences = [gen3, dcf];
  const authorizedStudies = useFencesAuthorizedStudies();
  const services: IFenceService[] = [
    {
      fence: FENCE_NAMES.gen3,
      name: 'Kids First Framework Services',
      icon: <KidsFirstLoginIcon width={45} height={45} />,
      onConnectToFence: () => {
        dispatch(fenceOpenAuhentificationTab(FENCE_NAMES.gen3));
      },
      onDisconnectFromFence: () => {
        dispatch(fenceDisconnection(FENCE_NAMES.gen3));
      },
    },
    {
      fence: FENCE_NAMES.dcf,
      name: 'NCI CRDC Framework Services',
      icon: <NciIcon width={45} height={45} />,
      onConnectToFence: () => {
        dispatch(fenceOpenAuhentificationTab(FENCE_NAMES.dcf));
      },
      onDisconnectFromFence: () => {
        dispatch(fenceDisconnection(FENCE_NAMES.dcf));
      },
    },
  ];

  useEffect(() => {
    if (!fences.some(({ status }) => status === FENCE_AUHTENTIFICATION_STATUS.connected)) {
      return;
    }

    dispatch(fetchAuthorizedStudies(fences));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gen3.status, dcf.status]);

  return (
    <AuthorizedStudiesWidget
      id={id}
      fences={fences}
      queryProps={{
        to: STATIC_ROUTES.DATA_EXPLORATION_DATAFILES,
        queryBuilderId: DATA_EXPLORATION_QB_ID,
        participantIndex: INDEXES.PARTICIPANT,
        fileIndex: INDEXES.FILE,
      }}
      authorizedStudies={authorizedStudies}
      className={className}
      services={services}
      dictionary={{
        title: intl.get('screen.dashboard.cards.authorizedStudies.title', {
          count: authorizedStudies.studies.length,
        }),
        connectedNotice: intl.get('screen.dashboard.cards.authorizedStudies.connectedNotice'),
        disconnectedNotice: intl.get('screen.dashboard.cards.authorizedStudies.disconnectedNotice'),
        manageConnections: intl.get('screen.dashboard.cards.authorizedStudies.manageConnections'),
        noAvailableStudies: intl.get('screen.dashboard.cards.authorizedStudies.noAvailableStudies'),
        authentification: {
          description: intl.get('screen.dashboard.cards.authorizedStudies.disconnectedNotice'),
          action: intl.get('global.connect'),
        },
        list: {
          authorization: intl.get('screen.dashboard.cards.authorizedStudies.authorization'),
          of: intl.get('screen.dashboard.cards.authorizedStudies.of'),
          dataGroups: intl.get('screen.dashboard.cards.authorizedStudies.dataGroups'),
          files: intl.get('screen.dashboard.cards.authorizedStudies.files'),
        },
        error: {
          title: intl.get('screen.dashboard.cards.error.title'),
          subtitle: intl.get('screen.dashboard.cards.error.subtitle'),
          email: SUPPORT_EMAIL,
          contactSupport: intl.get('screen.dashboard.cards.error.contactSupport'),
        },
        popover: {
          title: intl.get('screen.dashboard.cards.authorizedStudies.infoPopover.title'),
          applyingForDataAccess: intl.get(
            'screen.dashboard.cards.authorizedStudies.infoPopover.applyingForDataAccess',
          ),
          content: intl.get('screen.dashboard.cards.authorizedStudies.infoPopover.content'),
        },
        modal: {
          title: intl.get('screen.dashboard.cards.authorizedStudies.modal.title'),
          close: intl.get('global.close'),
          description: intl.get('screen.dashboard.cards.authorizedStudies.modal.description'),
          error: intl.get('screen.dashboard.cards.authorizedStudies.modal.error'),
        },
      }}
    />
  );
};

export default AuthorizedStudies;
