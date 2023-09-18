import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { DownloadOutlined } from '@ant-design/icons';
import { ISqonGroupFilter } from '@ferlab/ui/core/data/sqon/types';
import { Button, Dropdown } from 'antd';
import { MenuInfo } from 'rc-menu/lib/interface';
import { generateSelectionSqon } from 'views/DataExploration/utils/selectionSqon';

import { ReportType } from 'services/api/reports/models';
import { fetchReport } from 'store/report/thunks';

interface OwnProps {
  participantIds: string[];
  sqon?: ISqonGroupFilter;
  type?: 'default' | 'primary';
}

const DownloadClinicalDataDropdown = ({ participantIds, sqon, type = 'default' }: OwnProps) => {
  const dispatch = useDispatch();

  const getCurrentSqon = (): any => sqon || generateSelectionSqon('participant_id', participantIds);

  const menu = {
    onClick: (e: MenuInfo) =>
      dispatch(
        fetchReport({
          data: {
            sqon: getCurrentSqon(),
            name: e.key,
          },
        }),
      ),
    items: [
      {
        key: ReportType.CLINICAL_DATA,
        label: intl.get('api.report.clinicalData.participant', { count: participantIds.length }),
      },
      {
        key: ReportType.CLINICAL_DATA_FAM,
        label: intl.get('api.report.clinicalData.family', { count: participantIds.length }),
      },
    ],
  };

  return (
    <Dropdown
      key="actionDropdown"
      disabled={participantIds.length === 0}
      menu={menu}
      placement="bottomLeft"
    >
      <Button type={type} icon={<DownloadOutlined />}>
        {intl.get('api.report.clinicalData.download')}
      </Button>
    </Dropdown>
  );
};

export default DownloadClinicalDataDropdown;
