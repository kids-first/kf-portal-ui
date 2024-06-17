import intl from 'react-intl-universal';
import { Tooltip } from 'antd';
import { ColumnType } from 'antd/lib/table';
import { TABLE_EMPTY_PLACE_HOLDER } from '@ferlab/ui/core/common/constants';
import { IRequestBiospecimenDictionary } from '@ferlab/ui/core/components/BiospecimenRequest/requestBiospecimen.utils';
import { numberWithCommas } from '@ferlab/ui/core/utils/numberUtils';

import styles from './index.module.scss';
import { IRequestBioDataRow } from '@ferlab/ui/core/components/BiospecimenRequest/RequestBiospecimenTable';

export const getRequestBiospecimenDictionary = (): IRequestBiospecimenDictionary => ({
  buttonLabel: intl.get('screen.dataExploration.tabs.biospecimens.request.buttonLabel'),
  itemSelectionTooltip: intl.get('screen.dataExploration.itemSelectionTooltip'),
  modal: {
    title: intl.get('screen.dataExploration.tabs.biospecimens.request.modal.title'),
    okText: intl.get('screen.dataExploration.tabs.biospecimens.request.modal.okText'),
    cancelText: intl.get('screen.dataExploration.tabs.biospecimens.request.modal.cancelText'),
    closeText: intl.get('screen.dataExploration.tabs.biospecimens.request.modal.closeText'),
    description: intl.get(`screen.dataExploration.tabs.biospecimens.request.modal.description`),
    nameForm: {
      title: intl.get('screen.dataExploration.tabs.biospecimens.request.modal.nameForm.title'),
      note: intl.get('screen.dataExploration.tabs.biospecimens.request.modal.nameForm.note'),
      placeholder: intl.get(
        'screen.dataExploration.tabs.biospecimens.request.modal.nameForm.placeholder',
      ),
      requiredError: intl.get(
        'screen.dataExploration.tabs.biospecimens.request.modal.nameForm.requiredError',
      ),
      existingNameError: intl.get(
        'screen.dataExploration.tabs.biospecimens.request.modal.nameForm.existingNameError',
      ),
      maximumLength: intl.get(
        'screen.dataExploration.tabs.biospecimens.request.modal.nameForm.maximumLength',
      ),
    },
    alert: {
      errorMessage: intl.get(
        'screen.dataExploration.tabs.biospecimens.request.modal.alert.errorMessage',
      ),
      errorDescription: intl.get(
        'screen.dataExploration.tabs.biospecimens.request.modal.alert.errorDescription',
      ),
      infoMessage: intl.getHTML(
        'screen.dataExploration.tabs.biospecimens.request.modal.alert.infoMessage',
      ),
      infoDescription: intl.getHTML(
        'screen.dataExploration.tabs.biospecimens.request.modal.alert.infoDescription',
      ),
      limitMessage: intl.get(
        'screen.dataExploration.tabs.biospecimens.request.modal.alert.limitMessage',
      ),
      limitDescription: intl.get(
        'screen.dataExploration.tabs.biospecimens.request.modal.alert.limitDescription',
      ),
    },
  },
});

export const getDataTypeColumns = (): ColumnType<any>[] => [
  {
    key: 'study_code',
    title: intl.get('screen.dataExploration.tabs.biospecimens.request.modal.table.studyCode'),
    render: (record: IRequestBioDataRow) =>
      record.study_code ? (
        <Tooltip title={record.study_name}>{record.study_code}</Tooltip>
      ) : (
        TABLE_EMPTY_PLACE_HOLDER
      ),
  },
  {
    key: 'nb_participants',
    dataIndex: 'nb_participants',
    title: intl.get('screen.dataExploration.tabs.biospecimens.request.modal.table.nbParticipants'),
    render: (nb_participants: number) =>
      nb_participants ? numberWithCommas(nb_participants) : TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'nb_available_samples',
    dataIndex: 'nb_available_samples',
    title: (
      <Tooltip
        className={styles.tooltip}
        title={intl.get(
          'screen.dataExploration.tabs.biospecimens.request.modal.table.nbAvailableSamplesTooltip',
        )}
      >
        {intl.get(
          'screen.dataExploration.tabs.biospecimens.request.modal.table.nbAvailableSamples',
        )}
      </Tooltip>
    ),
    render: (nb_samples: number) =>
      nb_samples ? numberWithCommas(nb_samples) : TABLE_EMPTY_PLACE_HOLDER,
  },
];
