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
    showClear,
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
        color: 'rgb(52, 52, 52)',
        marginBottom: 5,
      }}
    >
      <Panel
        key={1}
        header={
          <Title
            level={3}
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
            <button type="link" onClick={handleClear}>
              clear
            </button>
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
