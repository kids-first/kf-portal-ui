import { Collapse, Divider, Input, Typography } from 'antd';
import { withTheme } from 'emotion-theming';
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
              color: `${props.theme.secondary}`,
              margin: 0,
              padding: 0,
              fontFamily: `${props.theme.fonts.default}`,
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
const FilterTableWithTheme = withTheme(FilterTable);

export default FilterTableWithTheme;
