import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { DownloadOutlined } from '@ant-design/icons';
import { ISqonGroupFilter } from '@ferlab/ui/core/data/sqon/types';
import { Button } from 'antd';
import { TAB_IDS } from 'views/DataExploration/utils/constant';
import { generateSelectionSqon } from 'views/DataExploration/utils/selectionSqon';

import { ReportType } from 'services/api/reports/models';
import { fetchReport } from 'store/report/thunks';

interface OwnProps {
  biospecimenIds: string[];
  sqon?: ISqonGroupFilter;
  type?: 'default' | 'primary';
  disabled?: boolean;
}

const DownloadDataButton = ({
  biospecimenIds,
  sqon,
  type = 'default',
  disabled = false,
}: OwnProps) => {
  const dispatch = useDispatch();

  return (
    <Button
      type={type}
      icon={<DownloadOutlined />}
      disabled={disabled}
      onClick={() =>
        dispatch(
          fetchReport({
            data: {
              sqon: sqon || generateSelectionSqon(TAB_IDS.BIOSPECIMENS, biospecimenIds),
              name: ReportType.BIOSEPCIMEN_DATA,
            },
          }),
        )
      }
    >
      {intl.get('api.report.biospecimenData.download')}
    </Button>
  );
};

export default DownloadDataButton;
