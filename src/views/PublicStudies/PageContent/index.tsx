import { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import ProLabel from '@ferlab/ui/core/components/ProLabel';
import ProTable from '@ferlab/ui/core/components/ProTable';
import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { Input, Space, Typography } from 'antd';
import { getColumns, TABLE_ID } from 'views/PublicStudies/utils';

import { useGlobals } from 'store/global';
import { getProTableDictionary } from 'utils/translation';

import styles from './index.module.css';

const { Title } = Typography;

const PageContent = () => {
  const [searchValue, setSearchValue] = useState('');

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

  const defaultColumns = getColumns();

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
          />
        }
      />
    </Space>
  );
};

export default PageContent;
