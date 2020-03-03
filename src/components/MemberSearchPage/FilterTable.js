import { Button, Collapse, Divider, Input, Typography } from 'antd';
import React from 'react';
import './MemberSearchPage.css';

const { Title } = Typography;
const { Panel } = Collapse;
const { Search } = Input;

const FilterTable = props => {
  const {
    showSearchDefault,
    collapsed,
    title,
    handleClear,
    handleChangeFilterString,
    showClear,
  } = props;
  return (
    <Collapse
      className={'aggregation-card search-members-Filter'}
      defaultActiveKey={['1']}
      style={{
        display: collapsed ? 'none' : 'block',
      }}
    >
      <Panel
        key={1}
        header={
          <Title
            level={4}
            className={'filter-title'}
            style={{
              margin: 0,
              display: 'inline-flex',
            }}
          >
            {title}
          </Title>
        }
        extra={
          showClear ? (
            <Button type="link" onClick={handleClear}>
              clear
            </Button>
          ) : (
            ''
          )
        }
      >
        {showSearchDefault && (
          <div>
            <Search placeholder="Search" onChange={handleChangeFilterString} />
            <Divider style={{ margin: 10 }} />
          </div>
        )}
        {props.children}
      </Panel>
    </Collapse>
  );
};

export default FilterTable;
