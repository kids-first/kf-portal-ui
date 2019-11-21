import { Collapse, Divider, Input, Typography } from 'antd';
import React from 'react';

const { Title } = Typography;
const { Panel } = Collapse;
const { Search } = Input;

const FilterTable = props => {
  const {
    showSearchDefault,
    collapsed,
    borderLeftColor,
    title,
    handleClear,
    handleChangeFilterString,
  } = props;
  return (
    //TODO move all styles in classes or modify ant design theme
    <Collapse
      defaultActiveKey={['1']}
      style={{
        backgroundColor: 'white',
        display: collapsed ? 'none' : 'block',
        borderLeftWidth: 5,
        borderLeftColor: borderLeftColor,
        borderRadius: 0,
      }}
    >
      <Panel
        key={1}
        header={
          <Title
            level={2}
            style={{
              color: 'rgb(43, 56, 143)',
              margin: 0,
              padding: 0,
              fontFamily: 'Montserrat, sans-serif',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 700,
              textAlign: 'center',
              display: 'inline-flex',
            }}
          >
            {title}
          </Title>
        }
        extra={<a onClick={handleClear}>clear</a>}
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
