import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import CavaticaWidget from '@ferlab/ui/core/components/Widgets/Cavatica';
import EnvironmentVariables from 'helpers/EnvVariables';

import { ICavaticaCreateProjectBody } from 'services/api/cavatica/models';
import { useCavaticaPassport } from 'store/passport';
import { passportActions } from 'store/passport/slice';
import {
  connectCavaticaPassport,
  createCavaticaProjet,
  disconnectCavaticaPassport,
  fetchCavaticaBillingGroups,
  fetchCavaticaProjects,
} from 'store/passport/thunks';
import { SUPPORT_EMAIL } from 'store/report/thunks';

import { DashboardCardProps } from '..';

const USER_BASE_URL = EnvironmentVariables.configFor('CAVATICA_USER_BASE_URL');

const Cavatica = ({ id, className = '' }: DashboardCardProps) => {
  const dispatch = useDispatch();
  const cavatica = useCavaticaPassport();

  return (
    <CavaticaWidget
      cavatica={cavatica}
      createProjectModalProps={{
        cavatica,
        handleErrorModalReset: () => {
          dispatch(passportActions.resetCavaticaBillingsGroupError());
          dispatch(passportActions.resetCavaticaProjectsError());
        },
        fetchBillingGroups: () => {
          dispatch(fetchCavaticaBillingGroups());
        },
        fetchProjects: () => {
          dispatch(fetchCavaticaProjects());
        },
        handleSubmit: (values: ICavaticaCreateProjectBody) => {
          dispatch(
            createCavaticaProjet({
              body: values,
            }),
          );
        },
      }}
      cavaticaUrl={USER_BASE_URL}
      className={className}
      handleDisconnection={() => {
        dispatch(disconnectCavaticaPassport());
      }}
      handleConnection={() => {
        dispatch(connectCavaticaPassport());
      }}
      id={id}
      dictionary={{
        title: intl.get('screen.dashboard.cards.cavatica.title'),
        connectedNotice: intl.get('screen.dashboard.cards.cavatica.connectedNotice'),
        disconnect: intl.get('screen.dashboard.cards.cavatica.disconnect'),
        popover: {
          title: intl.get('screen.dashboard.cards.cavatica.infoPopover.title'),
          readMore: intl.get('screen.dashboard.cards.cavatica.infoPopover.readMore'),
          content: intl.get('screen.dashboard.cards.cavatica.infoPopover.content'),
        },
        firstProject: intl.get('screen.dashboard.cards.cavatica.createNewProject'),
        newProject: intl.get('screen.dashboard.cards.cavatica.newProject'),
        noProject: intl.get('screen.dashboard.cards.cavatica.noProjects'),
        list: {
          membersCount: (count: number) =>
            intl.get('screen.dashboard.cards.cavatica.membersCount', {
              count,
            }),
        },
        connectCard: {
          action: intl.get('global.connect'),
          description: intl.get('screen.dashboard.cards.cavatica.disconnectedNotice'),
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
          error: {
            billingGroups: {
              title: intl.get('api.cavatica.error.billingGroups.title'),
              subtitle: intl.get('api.cavatica.error.billingGroups.fetch'),
            },
            create: {
              title: intl.get('screen.dashboard.cards.cavatica.error.create.title'),
              subtitle: intl.get('screen.dashboard.cards.cavatica.error.create.subtitle'),
            },
            email: SUPPORT_EMAIL,
            contactSupport: intl.get('screen.dashboard.cards.error.contactSupport'),
          },
          okText: intl.get('screen.dashboard.cards.cavatica.createProject'),
          cancelText: intl.get('screen.dashboard.cards.cavatica.cancelText'),
        },
        error: {
          fetch: {
            title: intl.get('screen.dashboard.cards.error.title'),
            disconnect: {
              start: intl.get('screen.dashboard.cards.error.disconnect.start'),
              end: intl.get('screen.dashboard.cards.error.disconnect.end'),
            },
          },
          email: SUPPORT_EMAIL,
          contactSupport: intl.get('screen.dashboard.cards.error.contactSupport'),
        },
      }}
    />
  );
};

export default Cavatica;
