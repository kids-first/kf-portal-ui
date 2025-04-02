import { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import ProLabel from '@ferlab/ui/core/components/ProLabel';
import ProTable from '@ferlab/ui/core/components/ProTable';
import SummarySumCell from '@ferlab/ui/core/components/ProTable/SummarySumCell';
import { ProColumnType, TProTableSummary } from '@ferlab/ui/core/components/ProTable/types';
import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { Input, Space, Typography } from 'antd';
import { getColumns, TABLE_ID } from 'views/PublicStudies/utils';

import LoginModal from 'components/PublicLayout/LoginModal';
import { IStudiesStatistic } from 'services/api/arranger/models';
import { useGlobals } from 'store/global';
import { getProTableDictionary } from 'utils/translation';

import styles from './index.module.css';

const { Title } = Typography;

const getSummaryColumns = (data: IStudiesStatistic[], defaultColumns: ProColumnType<any>[]) => {
  const summaryColumns: any[] = [];

  defaultColumns.forEach((c, index) => {
    let value: React.ReactNode = '';

    if (c.key === 'participant_count') {
      value = (
        <SummarySumCell
          title={intl.get('screen.studies.participants')}
          sum={data.reduce((accumulator, d) => accumulator + d.participant_count, 0)}
        />
      );
    } else if (c.key === 'family_count') {
      value = (
        <SummarySumCell
          title={intl.get('screen.studies.families')}
          sum={data.reduce((accumulator, d) => accumulator + (d.family_count ?? 0), 0)}
        />
      );
    }
    summaryColumns.push({ index, value, bordered: false });
  });

  if (summaryColumns.filter((sc) => sc.value != '').length > 0) {
    return summaryColumns as TProTableSummary[];
  }

  return [];
};

const PageContent = () => {
  const [searchValue, setSearchValue] = useState('');
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [redirectUri, setRedirectUri] = useState<string>();
  const manageLoginModal = (isOpen: boolean) => setOpenLoginModal(isOpen);
  const manageRedirectUri = (uri: string) => setRedirectUri(uri);

  const { stats, isFetchingStats } = useGlobals();
  const { studiesStatistics = [] } = stats || {};

  const [filteredStudies, setFilteredStudies] = useState(studiesStatistics);

  useEffect(() => {
    setFilteredStudies(studiesStatistics);
  }, [studiesStatistics]);

  const searchPrescription = (value: any) => {
    if (value?.target?.value) {
      const searchValue = value.target.value;
      setSearchValue(searchValue);

      const filteredValues = studiesStatistics.filter((study) =>
        study.study_name.toLowerCase().includes(searchValue.toLowerCase()),
      );
      setFilteredStudies(filteredValues);
    } else {
      setSearchValue('');
      setFilteredStudies(studiesStatistics);
    }
  };

  const defaultColumns = getColumns({ manageLoginModal, manageRedirectUri });

  return (
    <Space direction="vertical" size={16} className={styles.pageContent}>
      <Title className={styles.title} level={4}>
        {intl.get('screen.publicStudies.title')}
      </Title>

      <div>
        <ProLabel className={styles.label} title={intl.get('screen.publicStudies.search.title')} />
        <div className={styles.inputContainer}>
          <Input
            allowClear
            onChange={searchPrescription}
            placeholder={intl.get('screen.publicStudies.search.placeholder')}
            size="large"
            value={searchValue}
          />
        </div>
      </div>

      <GridCard
        content={
          <ProTable
            tableId={TABLE_ID}
            columns={defaultColumns}
            wrapperClassName={styles.tableWrapper}
            loading={isFetchingStats}
            showSorterTooltip={false}
            bordered
            headerConfig={{
              hideItemsCount: true,
            }}
            size="small"
            dataSource={filteredStudies.map((i) => ({ ...i, key: i.study_code }))}
            dictionary={getProTableDictionary()}
            summaryColumns={getSummaryColumns(filteredStudies, defaultColumns)}
          />
        }
      />
      {openLoginModal && (
        <LoginModal
          isOpen={openLoginModal}
          onClose={() => manageLoginModal(false)}
          redirectUri={redirectUri}
        />
      )}
    </Space>
  );
};

export default PageContent;
