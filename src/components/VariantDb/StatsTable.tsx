import React, { useEffect, useState } from 'react';
import { Col, List, Row } from 'antd';
import Title from 'antd/es/typography/Title';
import { fetchVariantDBStats } from './fetchVariantStats';

type VariantDbStats = {
  distinctVariantsCount: number;
  occurrencesCount: number;
  participantsCount: number;
  studiesCount: number;
};

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

const StatsTable = (): JSX.Element => {
  const [statsData, setStatsData] = useState(initialVariantStatsState);

  useEffect(() => {
    async function fetchStats() {
      try {
        const stats = await fetchVariantDBStats();
        const sourceDoc: VariantDbStats = stats._source;

        const data = [
          {
            name: 'Studies',
            value: sourceDoc.studiesCount,
          },
          {
            name: 'Participants',
            value: <div>{sourceDoc.participantsCount}</div>,
          },
          {
            name: 'Distinct Variants',
            value: sourceDoc.distinctVariantsCount,
          },
          {
            name: 'Occurrences',
            value: sourceDoc.occurrencesCount,
          },
        ];

        setStatsData(data);
      } catch (e) {
        console.error('Cannot fetch variant stats');
      }
    }
    fetchStats();
  }, []);

  return (
    <List
      header={
        <Row justify={'space-between'} className={'data-header-row'}>
          <Title
            level={4}
            style={{
              fontFamily: 'Open Sans',
              fontWeight: 600,
              fontSize: 16,
              lineHeight: '24px',
            }}
          >
            Data Release 1
          </Title>
          <div
            style={{
              fontFamily: 'Open Sans',
              fontWeight: 600,
              fontSize: 14,
              lineHeight: '22px',
              color: '#7D84A6',
            }}
          >
            January 21 , 2021
          </div>
        </Row>
      }
      dataSource={statsData}
      renderItem={(item) => (
        <List.Item>
          <Row className={'data-item-row'}>
            <Col
              style={{
                fontFamily: 'Open Sans',
                color: '#515885',
              }}
            >
              {item.name}
            </Col>
            <Col
              style={{
                fontFamily: 'Open Sans',
                color: '#515885',
              }}
            >
              {item.value}
            </Col>
          </Row>
        </List.Item>
      )}
    />
  );
};

export default StatsTable;
