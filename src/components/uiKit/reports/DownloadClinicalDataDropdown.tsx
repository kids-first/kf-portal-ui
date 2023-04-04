import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { DownloadOutlined } from '@ant-design/icons';
import { ISqonGroupFilter, ISyntheticSqon } from '@ferlab/ui/core/data/sqon/types';
import { Button, Dropdown, Menu } from 'antd';
import { INDEXES } from 'graphql/constants';
import { generateSelectionSqon } from 'views/DataExploration/utils/selectionSqon';

import { ReportType } from 'services/api/reports/models';
import { fetchReport } from 'store/report/thunks';

const CLINICAL_DATA_WITH_FAMILY = 'CLINICAL_DATA_WITH_FAMILY';

interface OwnProps {
  participantIds: string[];
  sqon?: ISqonGroupFilter;
  type?: 'default' | 'primary';
}

const DownloadClinicalDataDropdown = ({ participantIds, sqon, type = 'default' }: OwnProps) => {
  const dispatch = useDispatch();

  const getCurrentSqon = (): ISyntheticSqon =>
    sqon || generateSelectionSqon(INDEXES.PARTICIPANT, participantIds);

  const menu = (
    <Menu
      onClick={(e) =>
        dispatch(
          fetchReport({
            data: {
              sqon: getCurrentSqon(),
              name: ReportType.CLINICAL_DATA,
              withFamily: e.key === CLINICAL_DATA_WITH_FAMILY,
            },
          }),
        )
      }
      items={[
        {
          key: ReportType.CLINICAL_DATA,
          label: intl.get('api.report.clinicalData.participant', { count: participantIds.length }),
        },
        {
          key: CLINICAL_DATA_WITH_FAMILY,
          label: intl.get('api.report.clinicalData.family', { count: participantIds.length }),
        },
      ]}
    />
  );

  return (
    <Dropdown
      key="actionDropdown"
      disabled={participantIds.length === 0}
      overlay={menu}
      placement="bottomLeft"
    >
      <Button type={type} icon={<DownloadOutlined />}>
        {intl.get('api.report.clinicalData.download')}
      </Button>
    </Dropdown>
  );
};

export default DownloadClinicalDataDropdown;
