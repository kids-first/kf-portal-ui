import React, { FunctionComponent, useEffect, useState } from 'react';
import { Col, List, Row, Typography } from 'antd';
import { fetchVariantDBStats } from './fetchVariantStats';

import './StatsTable.scss';

type VariantDbStats = {
  distinctVariantsCount: number;
  occurrencesCount: number;
  participantsCount: number;
  studiesCount: number;
};

const { Title } = Typography;

const initialVariantStatsState = [
  {
    name: 'Studies',
    value: 0,
  },
  {
    name: 'Participants',
    value: <div>-</div>,
  },
  {
    name: 'Distinct Variants',
    value: 0,
  },
  {
    name: 'Occurrences',
    value: 0,
  },
];

const StatsTable: FunctionComponent = () => {
  const [statsData, setStatsData] = useState(initialVariantStatsState);

  useEffect(() => {
    async function fetchStats() {
      try {
        const stats: VariantDbStats = await fetchVariantDBStats();

        const data = [
          {
            name: 'Studies',
            value: stats.studiesCount,
          },
          {
            name: 'Participants',
            value: <div>{stats.participantsCount}</div>,
          },
          {
            name: 'Distinct Variants',
            value: stats.distinctVariantsCount,
          },
          {
            name: 'Occurrences',
            value: stats.occurrencesCount,
          },
        ];

        setStatsData(data);
      } catch (e) {
        console.error('Cannot fetch variant stats');
        setStatsData([]);
      }
    }
    fetchStats();
  }, []);

  return (
    <List
      header={
        <Row justify={'space-between'} className={'data-header-row'}>
          <Title level={4} className={'data-header-title'}>
            Data Release 1
          </Title>
          <div className={'data-header-value'}>January 21 , 2021</div>
        </Row>
      }
      dataSource={statsData}
      renderItem={(item) => (
        <List.Item>
          <Row className={'data-item-row'}>
            <Col>{item.name}</Col>
            <Col>{item.value}</Col>
          </Row>
        </List.Item>
      )}
    />
  );
};

export default StatsTable;
