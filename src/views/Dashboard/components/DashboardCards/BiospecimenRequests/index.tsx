import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import {
  IUserSetOutput,
  SHARED_BIOSPECIMEN_REQUEST_ID_QUERY_PARAM_KEY,
} from '@ferlab/ui/core/components/BiospecimenRequest/requestBiospecimen.utils';
import { addQuery } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import BiospecimenRequestsWidget from '@ferlab/ui/core/components/Widgets/BiospecimenRequests';
import { SET_ID_PREFIX } from '@ferlab/ui/core/data/sqon/types';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import copy from 'copy-to-clipboard';

import { SavedSetApi } from '../../../../../services/api/savedSet';
import { SetType } from '../../../../../services/api/savedSet/models';
import { globalActions } from '../../../../../store/global/slice';
import { SUPPORT_EMAIL } from '../../../../../store/report/thunks';
import { getSetFieldId, useSavedSet } from '../../../../../store/savedSet';
import { deleteSavedSet, updateSavedSet } from '../../../../../store/savedSet/thunks';
import { STATIC_ROUTES } from '../../../../../utils/routes';
import { SetActionType } from '../../../../DataExploration/components/SetsManagementDropdown';
import { DATA_EXPLORATION_QB_ID } from '../../../../DataExploration/utils/constant';
import { DashboardCardProps } from '..';

const BiospecimenRequests = ({ id, className = '' }: DashboardCardProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { savedSets, isLoading, fetchingError } = useSavedSet();
  const requests = savedSets.filter(
    (s) => s.setType === SetType.BIOSPECIMEN_REQUEST,
  ) as IUserSetOutput[];

  return (
    <BiospecimenRequestsWidget
      id={id}
      className={className}
      hasError={fetchingError}
      data={requests}
      loading={isLoading}
      dictionary={{
        error: {
          contactSupport: intl.get('screen.dashboard.cards.error.contactSupport'),
          subtitle: intl.get('screen.dashboard.cards.error.subtitle'),
          supportEmail: SUPPORT_EMAIL,
          title: intl.get('screen.dashboard.cards.error.title'),
        },
        lastSaved: (date: string) =>
          intl.get('screen.dashboard.cards.biospecimenRequest.lastSaved', {
            date,
          }),

        title: intl.get('screen.dashboard.cards.biospecimenRequest.title'),
        popover: {
          title: intl.get('screen.dashboard.cards.biospecimenRequest.titleInfo.title'),
          content: intl.getHTML('screen.dashboard.cards.biospecimenRequest.titleInfo.text', {
            href: STATIC_ROUTES.DATA_EXPLORATION_BIOSPECIMENS,
          }),
        },
        noBiospecimenRequests: intl.getHTML(
          'screen.dashboard.cards.biospecimenRequest.noBiospecimenRequests',
          {
            href: STATIC_ROUTES.DATA_EXPLORATION_BIOSPECIMENS,
          },
        ),
        modal: {
          edit: {
            errors: {
              duplicateName: intl.get(
                'screen.dashboard.cards.biospecimenRequest.editModal.existingNameError',
              ),
              maximumLength: intl.get(
                'screen.dashboard.cards.biospecimenRequest.editModal.maximumLength',
              ),
              required: intl.get(
                'screen.dashboard.cards.biospecimenRequest.editModal.requiredError',
              ),
            },
            inputLabel: intl.get('screen.dashboard.cards.biospecimenRequest.editModal.inputLabel'),
            modal: {
              cancelText: intl.get(
                'screen.dashboard.cards.biospecimenRequest.editModal.cancelText',
              ),
              okText: intl.get('screen.dashboard.cards.biospecimenRequest.editModal.okText'),
              title: intl.get('screen.dashboard.cards.biospecimenRequest.editModal.title'),
            },
            placeholder: intl.get(
              'screen.dashboard.cards.biospecimenRequest.editModal.placeholder',
            ),
          },
          delete: {
            title: intl.get('screen.dashboard.cards.biospecimenRequest.popupConfirm.delete.title'),
            okText: intl.get(
              'screen.dashboard.cards.biospecimenRequest.popupConfirm.delete.okText',
            ),
            content: intl.get(
              'screen.dashboard.cards.biospecimenRequest.popupConfirm.delete.content',
            ),
            cancelText: intl.get(
              'screen.dashboard.cards.biospecimenRequest.popupConfirm.delete.cancelText',
            ),
          },
          share: {
            title: intl.get('screen.dashboard.cards.biospecimenRequest.shareModal.title'),
            okText: intl.get('screen.dashboard.cards.biospecimenRequest.shareModal.okText'),
            content: intl.getHTML('screen.dashboard.cards.biospecimenRequest.shareModal.content'),
            cancelText: intl.getHTML(
              'screen.dashboard.cards.biospecimenRequest.shareModal.cancelText',
            ),
          },
        },
      }}
      handleListItemEdit={(id: string, name: string, callback: () => void) => {
        updateSavedSet({
          id,
          onCompleteCb: callback,
          subAction: SetActionType.RENAME_TAG,
          newTag: name,
          isBiospecimenRequest: true,
        });
      }}
      handleListItemShare={async (id: string) => {
        // call back to change sharedpublicly boolean
        const { data } = await SavedSetApi.shareById(id);
        if (data) {
          copy(
            `${window.location.protocol}//${window.location.host}` +
              `${STATIC_ROUTES.DATA_EXPLORATION_BIOSPECIMENS}?${SHARED_BIOSPECIMEN_REQUEST_ID_QUERY_PARAM_KEY}=${id}`,
          );
          dispatch(
            globalActions.displayNotification({
              type: 'success',
              message: intl.get(
                'screen.dashboard.cards.biospecimenRequest.shareLink.success.title',
              ),
              description: intl.get(
                'screen.dashboard.cards.biospecimenRequest.shareLink.success.description',
              ),
            }),
          );
        } else {
          dispatch(
            globalActions.displayNotification({
              type: 'error',
              message: intl.get('screen.dashboard.cards.biospecimenRequest.shareLink.error.title'),
              description: intl.get(
                'screen.dashboard.cards.biospecimenRequest.shareLink.error.description',
              ),
            }),
          );
        }
      }}
      handleListItemClick={(id: string) => {
        const setValue = `${SET_ID_PREFIX}${id}`;
        addQuery({
          queryBuilderId: DATA_EXPLORATION_QB_ID,
          query: generateQuery({
            newFilters: [
              generateValueFilter({
                field: getSetFieldId(SetType.BIOSPECIMEN_REQUEST),
                value: [setValue],
                index: SetType.BIOSPECIMEN,
              }),
            ],
          }),
          setAsActive: true,
        });
        navigate(STATIC_ROUTES.DATA_EXPLORATION_BIOSPECIMENS);
      }}
      handleListItemDelete={(id: string) => dispatch(deleteSavedSet(id))}
    />
  );
};

export default BiospecimenRequests;
