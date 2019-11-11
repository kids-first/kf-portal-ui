import {Collapse, Typography} from "antd";
import {withTheme} from "emotion-theming";
import React from "react";

const { Title } = Typography;
const { Panel } = Collapse;

const FilterTable = props => {
    return (
        <Collapse
            defaultActiveKey={['1']}
            style={{
                backgroundColor: 'white',
                display: props.collapsed ? 'none' : 'block',
                borderLeftWidth: 5,
                borderLeftColor: '#a42c90',
                borderRadius: 0,
            }}
        >
            <Panel
                key={1}
                header={
                    <Title
                        level={2}
                        style={{
                            color: `${props.color ? props.color : props.theme.secondary}`,
                            margin: 0,
                            padding: 0,
                            fontFamily: `${props.theme.fonts.default}`,
                            textDecoration: 'none',
                            fontSize: 14,
                            fontWeight: 700,
                            textAlign: 'center',
                            display:'inline-flex',
                        }}
                    >
                        {props.title}
                    </Title>
                }
                extra={<a onClick={props.clearboxes}>clear</a>}
            >
                {props.children}
            </Panel>
        </Collapse>
    );
};
const FilterTableWithTheme = withTheme(FilterTable);

export default FilterTableWithTheme;