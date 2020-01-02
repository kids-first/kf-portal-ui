import React from 'react';
import { Button, Checkbox, Col, List, Row, Tag } from 'antd';

const FilterTableList = ({
  dataSource,
  checkboxes,
  onChange,
  keyDisplayNames,
  searchString,
  showAll,
  toggleShowAll,
}) => {
  const dataKeys = dataSource ? Object.keys(dataSource) : [];

  const filteredDataKeys = searchString
    ? dataKeys.filter(key => key.includes(searchString))
    : dataKeys;

  const reorderData = [...filteredDataKeys.filter(f => checkboxes[f]), ...filteredDataKeys.filter(f => !checkboxes[f] )];

  const displayDataArray = showAll ? reorderData : reorderData.slice(0, 5);

  const dataArray = displayDataArray.reduce((acc, field) => {
    acc = [...acc, ...[{ [field]: dataSource[field] }]];
    return acc;
  }, []);

  const dataSourceLength = filteredDataKeys.length;

  return (
    <List
      split={false}
      footer={
        dataSourceLength > 5 && (
          <Button
            style={{ float: 'right', height: 30, padding: 0 }}
            type="link"
            icon={showAll ? 'minus-circle' : 'plus-circle'}
            onClick={toggleShowAll}
          >
            {showAll ? 'less' : 'more'}
          </Button>
        )
      }
      itemLayout="horizontal"
      dataSource={dataArray}
      renderItem={item => {
        const key = Object.keys(item)[0];
        const displayName = keyDisplayNames[key] ? keyDisplayNames[key] : key;
        return (
          <List.Item
            key={key}
            style={{
              paddingTop: 0,
              paddingBottom: 5,
              display:
                displayName && searchString && !displayName.includes(searchString)
                  ? 'none'
                  : 'list-item',
            }}
          >
            <Row
              type="flex"
              justify="space-around"
              align="middle"
              gutter={10}
              style={{ width: '100%' }}
            >
              <Col span={20}>
                <Checkbox
                  className={'flex'}
                  checked={checkboxes[key] ? checkboxes[key] : false}
                  onChange={onChange(key)}
                  disabled={!item[key]}
                >
                  <div style={{ wordBreak: 'break-word' }}>{displayName}</div>
                </Checkbox>
              </Col>
              <Col span={4}>
                <Tag
                  style={{
                    backgroundColor: 'rgba(169, 173, 192, 0.3)',
                    color: '#343434',
                    boxShadow: '0 0 0 1px #d9d9d9 inset',
                  }}
                >
                  {item[key]}
                </Tag>
              </Col>
            </Row>
          </List.Item>
        );
      }}
    />
  );
};

export default FilterTableList;
