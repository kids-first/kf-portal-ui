import { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Space, Switch, Typography } from 'antd';

const { Text } = Typography;

const FakeStorybook = () => {
  const [backgroundStyle, setBackgroundStyle] = useState({});

  return (
    <div style={{ margin: '16px', ...backgroundStyle }}>
      <div style={{ margin: '32px 0' }}>
        <span style={{ marginRight: '8px' }}>White Background</span>
        <Switch
          defaultChecked={false}
          onChange={(checked) =>
            checked ? setBackgroundStyle({ background: 'white' }) : setBackgroundStyle({})
          }
        />
      </div>
      <Space size={32} direction="vertical">
        {/* Large */}
        <Space size={32}>
          {/* Primary */}
          <Space direction="vertical">
            <Text>Primary</Text>
            <Text>Large</Text>
            <Button type="primary" size="large">
              Button
            </Button>
            <Button type="primary" size="large" loading>
              Button
            </Button>
            <Button type="primary" size="large" loading></Button>
            <Button type="primary" size="large" disabled>
              Button
            </Button>

            <Button icon={<SearchOutlined />} type="primary" size="large">
              Button
            </Button>
            <Button icon={<SearchOutlined />} type="primary" size="large" loading>
              Button
            </Button>
            <Button icon={<SearchOutlined />} type="primary" size="large" loading></Button>
            <Button icon={<SearchOutlined />} type="primary" size="large"></Button>
            <Button icon={<SearchOutlined />} type="primary" size="large" disabled>
              Button
            </Button>

            <Button danger type="primary" size="large">
              Button
            </Button>
            <Button danger type="primary" size="large" loading>
              Button
            </Button>
            <Button danger type="primary" size="large" loading></Button>
            <Button danger type="primary" size="large" disabled>
              Button
            </Button>

            <Button danger icon={<SearchOutlined />} type="primary" size="large">
              Button
            </Button>
            <Button danger icon={<SearchOutlined />} type="primary" size="large" loading>
              Button
            </Button>
            <Button danger icon={<SearchOutlined />} type="primary" size="large" loading></Button>
            <Button danger icon={<SearchOutlined />} type="primary" size="large"></Button>
            <Button danger icon={<SearchOutlined />} type="primary" size="large" disabled>
              Button
            </Button>
          </Space>

          {/* Default */}
          <Space direction="vertical">
            <Text>Default</Text>
            <Text>Large</Text>
            <Button size="large">Button</Button>
            <Button size="large" loading>
              Button
            </Button>
            <Button size="large" loading></Button>
            <Button size="large" disabled>
              Button
            </Button>

            <Button icon={<SearchOutlined />} size="large">
              Button
            </Button>
            <Button icon={<SearchOutlined />} size="large" loading>
              Button
            </Button>
            <Button icon={<SearchOutlined />} size="large" loading></Button>
            <Button icon={<SearchOutlined />} size="large"></Button>
            <Button icon={<SearchOutlined />} size="large" disabled>
              Button
            </Button>

            <Button danger size="large">
              Button
            </Button>
            <Button danger size="large" loading>
              Button
            </Button>
            <Button danger size="large" loading></Button>
            <Button danger size="large" disabled>
              Button
            </Button>

            <Button danger icon={<SearchOutlined />} size="large">
              Button
            </Button>
            <Button danger icon={<SearchOutlined />} size="large" loading>
              Button
            </Button>
            <Button danger icon={<SearchOutlined />} size="large" loading></Button>
            <Button danger icon={<SearchOutlined />} size="large"></Button>
            <Button danger icon={<SearchOutlined />} size="large" disabled>
              Button
            </Button>
          </Space>

          {/* Dashed */}
          <Space direction="vertical">
            <Text>Dashed</Text>
            <Text>Large</Text>
            <Button type="dashed" size="large">
              Button
            </Button>
            <Button type="dashed" size="large" loading>
              Button
            </Button>
            <Button type="dashed" size="large" loading></Button>
            <Button type="dashed" size="large" disabled>
              Button
            </Button>

            <Button icon={<SearchOutlined />} type="dashed" size="large">
              Button
            </Button>
            <Button icon={<SearchOutlined />} type="dashed" size="large" loading>
              Button
            </Button>
            <Button icon={<SearchOutlined />} type="dashed" size="large" loading></Button>
            <Button icon={<SearchOutlined />} type="dashed" size="large"></Button>
            <Button icon={<SearchOutlined />} type="dashed" size="large" disabled>
              Button
            </Button>

            <Button danger type="dashed" size="large">
              Button
            </Button>
            <Button danger type="dashed" size="large" loading>
              Button
            </Button>
            <Button danger type="dashed" size="large" loading></Button>
            <Button danger type="dashed" size="large" disabled>
              Button
            </Button>

            <Button danger icon={<SearchOutlined />} type="dashed" size="large">
              Button
            </Button>
            <Button danger icon={<SearchOutlined />} type="dashed" size="large" loading>
              Button
            </Button>
            <Button danger icon={<SearchOutlined />} type="dashed" size="large" loading></Button>
            <Button danger icon={<SearchOutlined />} type="dashed" size="large"></Button>
            <Button danger icon={<SearchOutlined />} type="dashed" size="large" disabled>
              Button
            </Button>
          </Space>

          {/* Text */}
          <Space direction="vertical">
            <Text>Text</Text>
            <Text>Large</Text>
            <Button type="text" size="large">
              Button
            </Button>
            <Button type="text" size="large" loading>
              Button
            </Button>
            <Button type="text" size="large" loading></Button>
            <Button type="text" size="large" disabled>
              Button
            </Button>

            <Button icon={<SearchOutlined />} type="text" size="large">
              Button
            </Button>
            <Button icon={<SearchOutlined />} type="text" size="large" loading>
              Button
            </Button>
            <Button icon={<SearchOutlined />} type="text" size="large" loading></Button>
            <Button icon={<SearchOutlined />} type="text" size="large"></Button>
            <Button icon={<SearchOutlined />} type="text" size="large" disabled>
              Button
            </Button>

            <Button danger type="text" size="large">
              Button
            </Button>
            <Button danger type="text" size="large" loading>
              Button
            </Button>
            <Button danger type="text" size="large" loading></Button>
            <Button danger type="text" size="large" disabled>
              Button
            </Button>

            <Button danger icon={<SearchOutlined />} type="text" size="large">
              Button
            </Button>
            <Button danger icon={<SearchOutlined />} type="text" size="large" loading>
              Button
            </Button>
            <Button danger icon={<SearchOutlined />} type="text" size="large" loading></Button>
            <Button danger icon={<SearchOutlined />} type="text" size="large"></Button>
            <Button danger icon={<SearchOutlined />} type="text" size="large" disabled>
              Button
            </Button>
          </Space>

          {/* Link */}
          <Space direction="vertical">
            <Text>Text</Text>
            <Text>Large</Text>
            <Button type="link" href="#" size="large">
              Button
            </Button>
            <Button type="link" href="#" size="large" loading>
              Button
            </Button>
            <Button type="link" href="#" size="large" loading></Button>
            <Button type="link" href="#" size="large" disabled>
              Button
            </Button>

            <Button icon={<SearchOutlined />} type="link" size="large">
              Button
            </Button>
            <Button icon={<SearchOutlined />} type="link" size="large" loading>
              Button
            </Button>
            <Button icon={<SearchOutlined />} type="link" size="large" loading></Button>
            <Button icon={<SearchOutlined />} type="link" size="large"></Button>
            <Button icon={<SearchOutlined />} type="link" size="large" disabled>
              Button
            </Button>

            <Button danger type="link" size="large">
              Button
            </Button>
            <Button danger type="link" size="large" loading>
              Button
            </Button>
            <Button danger type="link" size="large" loading></Button>
            <Button danger type="link" size="large" disabled>
              Button
            </Button>

            <Button danger icon={<SearchOutlined />} type="link" size="large">
              Button
            </Button>
            <Button danger icon={<SearchOutlined />} type="link" size="large" loading>
              Button
            </Button>
            <Button danger icon={<SearchOutlined />} type="link" size="large" loading></Button>
            <Button danger icon={<SearchOutlined />} type="link" size="large"></Button>
            <Button danger icon={<SearchOutlined />} type="link" size="large" disabled>
              Button
            </Button>
          </Space>
        </Space>

        {/* Default */}
        <Space size={32}>
          {/* Primary */}
          <Space direction="vertical">
            <Text>Primary</Text>
            <Text>Default</Text>
            <Button type="primary">Button</Button>
            <Button type="primary" loading>
              Button
            </Button>
            <Button type="primary" loading></Button>
            <Button type="primary" disabled>
              Button
            </Button>

            <Button icon={<SearchOutlined />} type="primary">
              Button
            </Button>
            <Button icon={<SearchOutlined />} type="primary" loading>
              Button
            </Button>
            <Button icon={<SearchOutlined />} type="primary" loading></Button>
            <Button icon={<SearchOutlined />} type="primary"></Button>
            <Button icon={<SearchOutlined />} type="primary" disabled>
              Button
            </Button>

            <Button danger type="primary">
              Button
            </Button>
            <Button danger type="primary" loading>
              Button
            </Button>
            <Button danger type="primary" loading></Button>
            <Button danger type="primary" disabled>
              Button
            </Button>

            <Button danger icon={<SearchOutlined />} type="primary">
              Button
            </Button>
            <Button danger icon={<SearchOutlined />} type="primary" loading>
              Button
            </Button>
            <Button danger icon={<SearchOutlined />} type="primary" loading></Button>
            <Button danger icon={<SearchOutlined />} type="primary"></Button>
            <Button danger icon={<SearchOutlined />} type="primary" disabled>
              Button
            </Button>
          </Space>

          {/* Default */}
          <Space direction="vertical">
            <Text>Default</Text>

            <Text>Default</Text>
            <Button>Button</Button>
            <Button loading>Button</Button>
            <Button loading></Button>
            <Button disabled>Button</Button>

            <Button icon={<SearchOutlined />}>Button</Button>
            <Button icon={<SearchOutlined />} loading>
              Button
            </Button>
            <Button icon={<SearchOutlined />} loading></Button>
            <Button icon={<SearchOutlined />}></Button>
            <Button icon={<SearchOutlined />} disabled>
              Button
            </Button>

            <Button danger>Button</Button>
            <Button danger loading>
              Button
            </Button>
            <Button danger loading></Button>
            <Button danger disabled>
              Button
            </Button>

            <Button danger icon={<SearchOutlined />}>
              Button
            </Button>
            <Button danger icon={<SearchOutlined />} loading>
              Button
            </Button>
            <Button danger icon={<SearchOutlined />} loading></Button>
            <Button danger icon={<SearchOutlined />}></Button>
            <Button danger icon={<SearchOutlined />} disabled>
              Button
            </Button>
          </Space>

          {/* Dashed */}
          <Space direction="vertical">
            <Text>Dashed</Text>
            <Text>Default</Text>
            <Button type="dashed">Button</Button>
            <Button type="dashed" loading>
              Button
            </Button>
            <Button type="dashed" loading></Button>
            <Button type="dashed" disabled>
              Button
            </Button>

            <Button icon={<SearchOutlined />} type="dashed">
              Button
            </Button>
            <Button icon={<SearchOutlined />} type="dashed" loading>
              Button
            </Button>
            <Button icon={<SearchOutlined />} type="dashed" loading></Button>
            <Button icon={<SearchOutlined />} type="dashed"></Button>
            <Button icon={<SearchOutlined />} type="dashed" disabled>
              Button
            </Button>

            <Button danger type="dashed">
              Button
            </Button>
            <Button danger type="dashed" loading>
              Button
            </Button>
            <Button danger type="dashed" loading></Button>
            <Button danger type="dashed" disabled>
              Button
            </Button>

            <Button danger icon={<SearchOutlined />} type="dashed">
              Button
            </Button>
            <Button danger icon={<SearchOutlined />} type="dashed" loading>
              Button
            </Button>
            <Button danger icon={<SearchOutlined />} type="dashed" loading></Button>
            <Button danger icon={<SearchOutlined />} type="dashed"></Button>
            <Button danger icon={<SearchOutlined />} type="dashed" disabled>
              Button
            </Button>
          </Space>

          {/* Text */}
          <Space direction="vertical">
            <Text>Text</Text>

            <Text>Default</Text>
            <Button type="text">Button</Button>
            <Button type="text" loading>
              Button
            </Button>
            <Button type="text" loading></Button>
            <Button type="text" disabled>
              Button
            </Button>

            <Button icon={<SearchOutlined />} type="text">
              Button
            </Button>
            <Button icon={<SearchOutlined />} type="text" loading>
              Button
            </Button>
            <Button icon={<SearchOutlined />} type="text" loading></Button>
            <Button icon={<SearchOutlined />} type="text"></Button>
            <Button icon={<SearchOutlined />} type="text" disabled>
              Button
            </Button>

            <Button danger type="text">
              Button
            </Button>
            <Button danger type="text" loading>
              Button
            </Button>
            <Button danger type="text" loading></Button>
            <Button danger type="text" disabled>
              Button
            </Button>

            <Button danger icon={<SearchOutlined />} type="text">
              Button
            </Button>
            <Button danger icon={<SearchOutlined />} type="text" loading>
              Button
            </Button>
            <Button danger icon={<SearchOutlined />} type="text" loading></Button>
            <Button danger icon={<SearchOutlined />} type="text"></Button>
            <Button danger icon={<SearchOutlined />} type="text" disabled>
              Button
            </Button>
          </Space>

          {/* Link */}
          <Space direction="vertical">
            <Text>Text</Text>

            <Text>Default</Text>
            <Button type="link" href="#">
              Button
            </Button>
            <Button type="link" href="#" loading>
              Button
            </Button>
            <Button type="link" href="#" loading></Button>
            <Button type="link" href="#" disabled>
              Button
            </Button>

            <Button icon={<SearchOutlined />} type="link">
              Button
            </Button>
            <Button icon={<SearchOutlined />} type="link" loading>
              Button
            </Button>
            <Button icon={<SearchOutlined />} type="link" loading></Button>
            <Button icon={<SearchOutlined />} type="link"></Button>
            <Button icon={<SearchOutlined />} type="link" disabled>
              Button
            </Button>

            <Button danger type="link">
              Button
            </Button>
            <Button danger type="link" loading>
              Button
            </Button>
            <Button danger type="link" loading></Button>
            <Button danger type="link" disabled>
              Button
            </Button>

            <Button danger icon={<SearchOutlined />} type="link">
              Button
            </Button>
            <Button danger icon={<SearchOutlined />} type="link" loading>
              Button
            </Button>
            <Button danger icon={<SearchOutlined />} type="link" loading></Button>
            <Button danger icon={<SearchOutlined />} type="link"></Button>
            <Button danger icon={<SearchOutlined />} type="link" disabled>
              Button
            </Button>
          </Space>
        </Space>

        {/* Small */}
        <Space size={32}>
          {/* Primary */}
          <Space direction="vertical">
            <Text>Primary</Text>
            <Text>Small</Text>
            <Button type="primary" size="small">
              Button
            </Button>
            <Button type="primary" size="small" loading>
              Button
            </Button>
            <Button type="primary" size="small" loading></Button>
            <Button type="primary" size="small" disabled>
              Button
            </Button>

            <Button icon={<SearchOutlined />} type="primary" size="small">
              Button
            </Button>
            <Button icon={<SearchOutlined />} type="primary" size="small" loading>
              Button
            </Button>
            <Button icon={<SearchOutlined />} type="primary" size="small" loading></Button>
            <Button icon={<SearchOutlined />} type="primary" size="small"></Button>
            <Button icon={<SearchOutlined />} type="primary" size="small" disabled>
              Button
            </Button>

            <Button danger type="primary" size="small">
              Button
            </Button>
            <Button danger type="primary" size="small" loading>
              Button
            </Button>
            <Button danger type="primary" size="small" loading></Button>
            <Button danger type="primary" size="small" disabled>
              Button
            </Button>

            <Button danger icon={<SearchOutlined />} type="primary" size="small">
              Button
            </Button>
            <Button danger icon={<SearchOutlined />} type="primary" size="small" loading>
              Button
            </Button>
            <Button danger icon={<SearchOutlined />} type="primary" size="small" loading></Button>
            <Button danger icon={<SearchOutlined />} type="primary" size="small"></Button>
            <Button danger icon={<SearchOutlined />} type="primary" size="small" disabled>
              Button
            </Button>
          </Space>

          {/* Default */}
          <Space direction="vertical">
            <Text>Default</Text>
            <Text>Small</Text>
            <Button size="small">Button</Button>
            <Button size="small" loading>
              Button
            </Button>
            <Button size="small" loading></Button>
            <Button size="small" disabled>
              Button
            </Button>

            <Button icon={<SearchOutlined />} size="small">
              Button
            </Button>
            <Button icon={<SearchOutlined />} size="small" loading>
              Button
            </Button>
            <Button icon={<SearchOutlined />} size="small" loading></Button>
            <Button icon={<SearchOutlined />} size="small"></Button>
            <Button icon={<SearchOutlined />} size="small" disabled>
              Button
            </Button>

            <Button danger size="small">
              Button
            </Button>
            <Button danger size="small" loading>
              Button
            </Button>
            <Button danger size="small" loading></Button>
            <Button danger size="small" disabled>
              Button
            </Button>

            <Button danger icon={<SearchOutlined />} size="small">
              Button
            </Button>
            <Button danger icon={<SearchOutlined />} size="small" loading>
              Button
            </Button>
            <Button danger icon={<SearchOutlined />} size="small" loading></Button>
            <Button danger icon={<SearchOutlined />} size="small"></Button>
            <Button danger icon={<SearchOutlined />} size="small" disabled>
              Button
            </Button>
          </Space>

          {/* Dashed */}
          <Space direction="vertical">
            <Text>Dashed</Text>
            <Text>Small</Text>
            <Button type="dashed" size="small">
              Button
            </Button>
            <Button type="dashed" size="small" loading>
              Button
            </Button>
            <Button type="dashed" size="small" loading></Button>
            <Button type="dashed" size="small" disabled>
              Button
            </Button>

            <Button icon={<SearchOutlined />} type="dashed" size="small">
              Button
            </Button>
            <Button icon={<SearchOutlined />} type="dashed" size="small" loading>
              Button
            </Button>
            <Button icon={<SearchOutlined />} type="dashed" size="small" loading></Button>
            <Button icon={<SearchOutlined />} type="dashed" size="small"></Button>
            <Button icon={<SearchOutlined />} type="dashed" size="small" disabled>
              Button
            </Button>

            <Button danger type="dashed" size="small">
              Button
            </Button>
            <Button danger type="dashed" size="small" loading>
              Button
            </Button>
            <Button danger type="dashed" size="small" loading></Button>
            <Button danger type="dashed" size="small" disabled>
              Button
            </Button>

            <Button danger icon={<SearchOutlined />} type="dashed" size="small">
              Button
            </Button>
            <Button danger icon={<SearchOutlined />} type="dashed" size="small" loading>
              Button
            </Button>
            <Button danger icon={<SearchOutlined />} type="dashed" size="small" loading></Button>
            <Button danger icon={<SearchOutlined />} type="dashed" size="small"></Button>
            <Button danger icon={<SearchOutlined />} type="dashed" size="small" disabled>
              Button
            </Button>
          </Space>

          {/* Text */}
          <Space direction="vertical">
            <Text>Text</Text>
            <Text>Small</Text>
            <Button type="text" size="small">
              Button
            </Button>
            <Button type="text" size="small" loading>
              Button
            </Button>
            <Button type="text" size="small" loading></Button>
            <Button type="text" size="small" disabled>
              Button
            </Button>

            <Button icon={<SearchOutlined />} type="text" size="small">
              Button
            </Button>
            <Button icon={<SearchOutlined />} type="text" size="small" loading>
              Button
            </Button>
            <Button icon={<SearchOutlined />} type="text" size="small" loading></Button>
            <Button icon={<SearchOutlined />} type="text" size="small"></Button>
            <Button icon={<SearchOutlined />} type="text" size="small" disabled>
              Button
            </Button>

            <Button danger type="text" size="small">
              Button
            </Button>
            <Button danger type="text" size="small" loading>
              Button
            </Button>
            <Button danger type="text" size="small" loading></Button>
            <Button danger type="text" size="small" disabled>
              Button
            </Button>

            <Button danger icon={<SearchOutlined />} type="text" size="small">
              Button
            </Button>
            <Button danger icon={<SearchOutlined />} type="text" size="small" loading>
              Button
            </Button>
            <Button danger icon={<SearchOutlined />} type="text" size="small" loading></Button>
            <Button danger icon={<SearchOutlined />} type="text" size="small"></Button>
            <Button danger icon={<SearchOutlined />} type="text" size="small" disabled>
              Button
            </Button>
          </Space>

          {/* Link */}
          <Space direction="vertical">
            <Text>Text</Text>
            <Text>Small</Text>
            <Button type="link" href="#" size="small">
              Button
            </Button>
            <Button type="link" href="#" size="small" loading>
              Button
            </Button>
            <Button type="link" href="#" size="small" loading></Button>
            <Button type="link" href="#" size="small" disabled>
              Button
            </Button>

            <Button icon={<SearchOutlined />} type="link" size="small">
              Button
            </Button>
            <Button icon={<SearchOutlined />} type="link" size="small" loading>
              Button
            </Button>
            <Button icon={<SearchOutlined />} type="link" size="small" loading></Button>
            <Button icon={<SearchOutlined />} type="link" size="small"></Button>
            <Button icon={<SearchOutlined />} type="link" size="small" disabled>
              Button
            </Button>

            <Button danger type="link" size="small">
              Button
            </Button>
            <Button danger type="link" size="small" loading>
              Button
            </Button>
            <Button danger type="link" size="small" loading></Button>
            <Button danger type="link" size="small" disabled>
              Button
            </Button>

            <Button danger icon={<SearchOutlined />} type="link" size="small">
              Button
            </Button>
            <Button danger icon={<SearchOutlined />} type="link" size="small" loading>
              Button
            </Button>
            <Button danger icon={<SearchOutlined />} type="link" size="small" loading></Button>
            <Button danger icon={<SearchOutlined />} type="link" size="small"></Button>
            <Button danger icon={<SearchOutlined />} type="link" size="small" disabled>
              Button
            </Button>
          </Space>
        </Space>

        {/* Ghost Large */}
        <Space size={32}>
          {/* Primary */}
          <Space direction="vertical">
            <Text>Ghost Primary</Text>
            <Text>Large</Text>
            <Button ghost type="primary" size="large">
              Button
            </Button>
            <Button ghost type="primary" size="large" loading>
              Button
            </Button>
            <Button ghost type="primary" size="large" loading></Button>
            <Button ghost type="primary" size="large" disabled>
              Button
            </Button>
            <Button ghost icon={<SearchOutlined />} type="primary" size="large">
              Button
            </Button>
            <Button ghost icon={<SearchOutlined />} type="primary" size="large" loading>
              Button
            </Button>
            <Button ghost icon={<SearchOutlined />} type="primary" size="large" loading></Button>
            <Button ghost icon={<SearchOutlined />} type="primary" size="large"></Button>
            <Button ghost icon={<SearchOutlined />} type="primary" size="large" disabled>
              Button
            </Button>

            <Button ghost danger type="primary" size="large">
              Button
            </Button>
            <Button ghost danger type="primary" size="large" loading>
              Button
            </Button>
            <Button ghost danger type="primary" size="large" loading></Button>
            <Button ghost danger type="primary" size="large" disabled>
              Button
            </Button>

            <Button ghost danger icon={<SearchOutlined />} type="primary" size="large">
              Button
            </Button>
            <Button ghost danger icon={<SearchOutlined />} type="primary" size="large" loading>
              Button
            </Button>
            <Button
              ghost
              danger
              icon={<SearchOutlined />}
              type="primary"
              size="large"
              loading
            ></Button>
            <Button ghost danger icon={<SearchOutlined />} type="primary" size="large"></Button>
            <Button ghost danger icon={<SearchOutlined />} type="primary" size="large" disabled>
              Button
            </Button>
          </Space>

          {/* Default */}
          <Space direction="vertical">
            <Text>Ghost Default</Text>
            <Text>Large</Text>
            <Button ghost size="large">
              Button
            </Button>
            <Button ghost size="large" loading>
              Button
            </Button>
            <Button ghost size="large" loading></Button>
            <Button ghost size="large" disabled>
              Button
            </Button>

            <Button ghost icon={<SearchOutlined />} size="large">
              Button
            </Button>
            <Button ghost icon={<SearchOutlined />} size="large" loading>
              Button
            </Button>
            <Button ghost icon={<SearchOutlined />} size="large" loading></Button>
            <Button ghost icon={<SearchOutlined />} size="large"></Button>
            <Button ghost icon={<SearchOutlined />} size="large" disabled>
              Button
            </Button>

            <Button ghost danger size="large">
              Button
            </Button>
            <Button ghost danger size="large" loading>
              Button
            </Button>
            <Button ghost danger size="large" loading></Button>
            <Button ghost danger size="large" disabled>
              Button
            </Button>

            <Button ghost danger icon={<SearchOutlined />} size="large">
              Button
            </Button>
            <Button ghost danger icon={<SearchOutlined />} size="large" loading>
              Button
            </Button>
            <Button ghost danger icon={<SearchOutlined />} size="large" loading></Button>
            <Button ghost danger icon={<SearchOutlined />} size="large"></Button>
            <Button ghost danger icon={<SearchOutlined />} size="large" disabled>
              Button
            </Button>
          </Space>

          {/* Dashed */}
          <Space direction="vertical">
            <Text>Ghost Dashed</Text>
            <Text>Large</Text>
            <Button ghost type="dashed" size="large">
              Button
            </Button>
            <Button ghost type="dashed" size="large" loading>
              Button
            </Button>
            <Button ghost type="dashed" size="large" loading></Button>
            <Button ghost type="dashed" size="large" disabled>
              Button
            </Button>

            <Button ghost icon={<SearchOutlined />} type="dashed" size="large">
              Button
            </Button>
            <Button ghost icon={<SearchOutlined />} type="dashed" size="large" loading>
              Button
            </Button>
            <Button ghost icon={<SearchOutlined />} type="dashed" size="large" loading></Button>
            <Button ghost icon={<SearchOutlined />} type="dashed" size="large"></Button>
            <Button ghost icon={<SearchOutlined />} type="dashed" size="large" disabled>
              Button
            </Button>

            <Button ghost danger type="dashed" size="large">
              Button
            </Button>
            <Button ghost danger type="dashed" size="large" loading>
              Button
            </Button>
            <Button ghost danger type="dashed" size="large" loading></Button>
            <Button ghost danger type="dashed" size="large" disabled>
              Button
            </Button>

            <Button ghost danger icon={<SearchOutlined />} type="dashed" size="large">
              Button
            </Button>
            <Button ghost danger icon={<SearchOutlined />} type="dashed" size="large" loading>
              Button
            </Button>
            <Button
              ghost
              danger
              icon={<SearchOutlined />}
              type="dashed"
              size="large"
              loading
            ></Button>
            <Button ghost danger icon={<SearchOutlined />} type="dashed" size="large"></Button>
            <Button ghost danger icon={<SearchOutlined />} type="dashed" size="large" disabled>
              Button
            </Button>
          </Space>

          {/* Text */}
          <Space direction="vertical">
            <Text>Ghost Text</Text>
            <Text>Large</Text>
            <Button ghost type="text" size="large">
              Button
            </Button>
            <Button ghost type="text" size="large" loading>
              Button
            </Button>
            <Button ghost type="text" size="large" loading></Button>
            <Button ghost type="text" size="large" disabled>
              Button
            </Button>

            <Button ghost icon={<SearchOutlined />} type="text" size="large">
              Button
            </Button>
            <Button ghost icon={<SearchOutlined />} type="text" size="large" loading>
              Button
            </Button>
            <Button ghost icon={<SearchOutlined />} type="text" size="large" loading></Button>
            <Button ghost icon={<SearchOutlined />} type="text" size="large"></Button>
            <Button ghost icon={<SearchOutlined />} type="text" size="large" disabled>
              Button
            </Button>

            <Button ghost danger type="text" size="large">
              Button
            </Button>
            <Button ghost danger type="text" size="large" loading>
              Button
            </Button>
            <Button ghost danger type="text" size="large" loading></Button>
            <Button ghost danger type="text" size="large" disabled>
              Button
            </Button>

            <Button ghost danger icon={<SearchOutlined />} type="text" size="large">
              Button
            </Button>
            <Button ghost danger icon={<SearchOutlined />} type="text" size="large" loading>
              Button
            </Button>
            <Button
              ghost
              danger
              icon={<SearchOutlined />}
              type="text"
              size="large"
              loading
            ></Button>
            <Button ghost danger icon={<SearchOutlined />} type="text" size="large"></Button>
            <Button ghost danger icon={<SearchOutlined />} type="text" size="large" disabled>
              Button
            </Button>
          </Space>

          {/* Ghost Link */}
          <Space direction="vertical">
            <Text>Ghost Text</Text>
            <Text>Large</Text>
            <Button ghost type="link" href="#" size="large">
              Button
            </Button>
            <Button ghost type="link" href="#" size="large" loading>
              Button
            </Button>
            <Button ghost type="link" href="#" size="large" loading></Button>
            <Button ghost type="link" href="#" size="large" disabled>
              Button
            </Button>

            <Button ghost icon={<SearchOutlined />} type="link" size="large">
              Button
            </Button>
            <Button ghost icon={<SearchOutlined />} type="link" size="large" loading>
              Button
            </Button>
            <Button ghost icon={<SearchOutlined />} type="link" size="large" loading></Button>
            <Button ghost icon={<SearchOutlined />} type="link" size="large"></Button>
            <Button ghost icon={<SearchOutlined />} type="link" size="large" disabled>
              Button
            </Button>

            <Button ghost danger type="link" size="large">
              Button
            </Button>
            <Button ghost danger type="link" size="large" loading>
              Button
            </Button>
            <Button ghost danger type="link" size="large" loading></Button>
            <Button ghost danger type="link" size="large" disabled>
              Button
            </Button>

            <Button ghost danger icon={<SearchOutlined />} type="link" size="large">
              Button
            </Button>
            <Button ghost danger icon={<SearchOutlined />} type="link" size="large" loading>
              Button
            </Button>
            <Button
              ghost
              danger
              icon={<SearchOutlined />}
              type="link"
              size="large"
              loading
            ></Button>
            <Button ghost danger icon={<SearchOutlined />} type="link" size="large"></Button>
            <Button ghost danger icon={<SearchOutlined />} type="link" size="large" disabled>
              Button
            </Button>
          </Space>
        </Space>

        {/* Ghost Default */}
        <Space size={32}>
          {/* Primary */}
          <Space direction="vertical">
            <Text>Ghost Primary</Text>
            <Text>Default</Text>
            <Button ghost type="primary">
              Button
            </Button>
            <Button ghost type="primary" loading>
              Button
            </Button>
            <Button ghost type="primary" loading></Button>
            <Button ghost type="primary" disabled>
              Button
            </Button>

            <Button ghost icon={<SearchOutlined />} type="primary">
              Button
            </Button>
            <Button ghost icon={<SearchOutlined />} type="primary" loading>
              Button
            </Button>
            <Button ghost icon={<SearchOutlined />} type="primary" loading></Button>
            <Button ghost icon={<SearchOutlined />} type="primary"></Button>
            <Button ghost icon={<SearchOutlined />} type="primary" disabled>
              Button
            </Button>

            <Button ghost danger type="primary">
              Button
            </Button>
            <Button ghost danger type="primary" loading>
              Button
            </Button>
            <Button ghost danger type="primary" loading></Button>
            <Button ghost danger type="primary" disabled>
              Button
            </Button>

            <Button ghost danger icon={<SearchOutlined />} type="primary">
              Button
            </Button>
            <Button ghost danger icon={<SearchOutlined />} type="primary" loading>
              Button
            </Button>
            <Button ghost danger icon={<SearchOutlined />} type="primary" loading></Button>
            <Button ghost danger icon={<SearchOutlined />} type="primary"></Button>
            <Button ghost danger icon={<SearchOutlined />} type="primary" disabled>
              Button
            </Button>
          </Space>

          {/* Default */}
          <Space direction="vertical">
            <Text>Ghost Default</Text>

            <Text>Default</Text>
            <Button ghost>Button</Button>
            <Button ghost loading>
              Button
            </Button>
            <Button ghost loading></Button>
            <Button ghost disabled>
              Button
            </Button>

            <Button ghost icon={<SearchOutlined />}>
              Button
            </Button>
            <Button ghost icon={<SearchOutlined />} loading>
              Button
            </Button>
            <Button ghost icon={<SearchOutlined />} loading></Button>
            <Button ghost icon={<SearchOutlined />}></Button>
            <Button ghost icon={<SearchOutlined />} disabled>
              Button
            </Button>

            <Button ghost danger>
              Button
            </Button>
            <Button ghost danger loading>
              Button
            </Button>
            <Button ghost danger loading></Button>
            <Button ghost danger disabled>
              Button
            </Button>

            <Button ghost danger icon={<SearchOutlined />}>
              Button
            </Button>
            <Button ghost danger icon={<SearchOutlined />} loading>
              Button
            </Button>
            <Button ghost danger icon={<SearchOutlined />} loading></Button>
            <Button ghost danger icon={<SearchOutlined />}></Button>
            <Button ghost danger icon={<SearchOutlined />} disabled>
              Button
            </Button>
          </Space>

          {/* Dashed */}
          <Space direction="vertical">
            <Text>Ghost Dashed</Text>
            <Text>Default</Text>
            <Button ghost type="dashed">
              Button
            </Button>
            <Button ghost type="dashed" loading>
              Button
            </Button>
            <Button ghost type="dashed" loading></Button>
            <Button ghost type="dashed" disabled>
              Button
            </Button>

            <Button ghost icon={<SearchOutlined />} type="dashed">
              Button
            </Button>
            <Button ghost icon={<SearchOutlined />} type="dashed" loading>
              Button
            </Button>
            <Button ghost icon={<SearchOutlined />} type="dashed" loading></Button>
            <Button ghost icon={<SearchOutlined />} type="dashed"></Button>
            <Button ghost icon={<SearchOutlined />} type="dashed" disabled>
              Button
            </Button>

            <Button ghost danger type="dashed">
              Button
            </Button>
            <Button ghost danger type="dashed" loading>
              Button
            </Button>
            <Button ghost danger type="dashed" loading></Button>
            <Button ghost danger type="dashed" disabled>
              Button
            </Button>

            <Button ghost danger icon={<SearchOutlined />} type="dashed">
              Button
            </Button>
            <Button ghost danger icon={<SearchOutlined />} type="dashed" loading>
              Button
            </Button>
            <Button ghost danger icon={<SearchOutlined />} type="dashed" loading></Button>
            <Button ghost danger icon={<SearchOutlined />} type="dashed"></Button>
            <Button ghost danger icon={<SearchOutlined />} type="dashed" disabled>
              Button
            </Button>
          </Space>

          {/* Text */}
          <Space direction="vertical">
            <Text>Ghost Text</Text>

            <Text>Default</Text>
            <Button ghost type="text">
              Button
            </Button>
            <Button ghost type="text" loading>
              Button
            </Button>
            <Button ghost type="text" loading></Button>
            <Button ghost type="text" disabled>
              Button
            </Button>

            <Button ghost icon={<SearchOutlined />} type="text">
              Button
            </Button>
            <Button ghost icon={<SearchOutlined />} type="text" loading>
              Button
            </Button>
            <Button ghost icon={<SearchOutlined />} type="text" loading></Button>
            <Button ghost icon={<SearchOutlined />} type="text"></Button>
            <Button ghost icon={<SearchOutlined />} type="text" disabled>
              Button
            </Button>

            <Button ghost danger type="text">
              Button
            </Button>
            <Button ghost danger type="text" loading>
              Button
            </Button>
            <Button ghost danger type="text" loading></Button>
            <Button ghost danger type="text" disabled>
              Button
            </Button>

            <Button ghost danger icon={<SearchOutlined />} type="text">
              Button
            </Button>
            <Button ghost danger icon={<SearchOutlined />} type="text" loading>
              Button
            </Button>
            <Button ghost danger icon={<SearchOutlined />} type="text" loading></Button>
            <Button ghost danger icon={<SearchOutlined />} type="text"></Button>
            <Button ghost danger icon={<SearchOutlined />} type="text" disabled>
              Button
            </Button>
          </Space>

          {/* Link */}
          <Space direction="vertical">
            <Text>Ghost Text</Text>

            <Text>Default</Text>
            <Button ghost type="link" href="#">
              Button
            </Button>
            <Button ghost type="link" href="#" loading>
              Button
            </Button>
            <Button ghost type="link" href="#" loading></Button>
            <Button ghost type="link" href="#" disabled>
              Button
            </Button>

            <Button ghost icon={<SearchOutlined />} type="link">
              Button
            </Button>
            <Button ghost icon={<SearchOutlined />} type="link" loading>
              Button
            </Button>
            <Button ghost icon={<SearchOutlined />} type="link" loading></Button>
            <Button ghost icon={<SearchOutlined />} type="link"></Button>
            <Button ghost icon={<SearchOutlined />} type="link" disabled>
              Button
            </Button>

            <Button ghost danger type="link">
              Button
            </Button>
            <Button ghost danger type="link" loading>
              Button
            </Button>
            <Button ghost danger type="link" loading></Button>
            <Button ghost danger type="link" disabled>
              Button
            </Button>

            <Button ghost danger icon={<SearchOutlined />} type="link">
              Button
            </Button>
            <Button ghost danger icon={<SearchOutlined />} type="link" loading>
              Button
            </Button>
            <Button ghost danger icon={<SearchOutlined />} type="link" loading></Button>
            <Button ghost danger icon={<SearchOutlined />} type="link"></Button>
            <Button ghost danger icon={<SearchOutlined />} type="link" disabled>
              Button
            </Button>
          </Space>
        </Space>

        {/* Ghost Small */}
        <Space size={32}>
          {/* Primary */}
          <Space direction="vertical">
            <Text>Ghost Primary</Text>
            <Text>Small</Text>
            <Button ghost type="primary" size="small">
              Button
            </Button>
            <Button ghost type="primary" size="small" loading>
              Button
            </Button>
            <Button ghost type="primary" size="small" loading></Button>
            <Button ghost type="primary" size="small" disabled>
              Button
            </Button>

            <Button ghost icon={<SearchOutlined />} type="primary" size="small">
              Button
            </Button>
            <Button ghost icon={<SearchOutlined />} type="primary" size="small" loading>
              Button
            </Button>
            <Button ghost icon={<SearchOutlined />} type="primary" size="small" loading></Button>
            <Button ghost icon={<SearchOutlined />} type="primary" size="small"></Button>
            <Button ghost icon={<SearchOutlined />} type="primary" size="small" disabled>
              Button
            </Button>

            <Button ghost danger type="primary" size="small">
              Button
            </Button>
            <Button ghost danger type="primary" size="small" loading>
              Button
            </Button>
            <Button ghost danger type="primary" size="small" loading></Button>
            <Button ghost danger type="primary" size="small" disabled>
              Button
            </Button>

            <Button ghost danger icon={<SearchOutlined />} type="primary" size="small">
              Button
            </Button>
            <Button ghost danger icon={<SearchOutlined />} type="primary" size="small" loading>
              Button
            </Button>
            <Button
              ghost
              danger
              icon={<SearchOutlined />}
              type="primary"
              size="small"
              loading
            ></Button>
            <Button ghost danger icon={<SearchOutlined />} type="primary" size="small"></Button>
            <Button ghost danger icon={<SearchOutlined />} type="primary" size="small" disabled>
              Button
            </Button>
          </Space>

          {/* Default */}
          <Space direction="vertical">
            <Text>Ghost Default</Text>
            <Text>Small</Text>
            <Button ghost size="small">
              Button
            </Button>
            <Button ghost size="small" loading>
              Button
            </Button>
            <Button ghost size="small" loading></Button>
            <Button ghost size="small" disabled>
              Button
            </Button>

            <Button ghost icon={<SearchOutlined />} size="small">
              Button
            </Button>
            <Button ghost icon={<SearchOutlined />} size="small" loading>
              Button
            </Button>
            <Button ghost icon={<SearchOutlined />} size="small" loading></Button>
            <Button ghost icon={<SearchOutlined />} size="small"></Button>
            <Button ghost icon={<SearchOutlined />} size="small" disabled>
              Button
            </Button>

            <Button ghost danger size="small">
              Button
            </Button>
            <Button ghost danger size="small" loading>
              Button
            </Button>
            <Button ghost danger size="small" loading></Button>
            <Button ghost danger size="small" disabled>
              Button
            </Button>

            <Button ghost danger icon={<SearchOutlined />} size="small">
              Button
            </Button>
            <Button ghost danger icon={<SearchOutlined />} size="small" loading>
              Button
            </Button>
            <Button ghost danger icon={<SearchOutlined />} size="small" loading></Button>
            <Button ghost danger icon={<SearchOutlined />} size="small"></Button>
            <Button ghost danger icon={<SearchOutlined />} size="small" disabled>
              Button
            </Button>
          </Space>

          {/* Dashed */}
          <Space direction="vertical">
            <Text>Ghost Dashed</Text>
            <Text>Small</Text>
            <Button ghost type="dashed" size="small">
              Button
            </Button>
            <Button ghost type="dashed" size="small" loading>
              Button
            </Button>
            <Button ghost type="dashed" size="small" loading></Button>
            <Button ghost type="dashed" size="small" disabled>
              Button
            </Button>

            <Button ghost icon={<SearchOutlined />} type="dashed" size="small">
              Button
            </Button>
            <Button ghost icon={<SearchOutlined />} type="dashed" size="small" loading>
              Button
            </Button>
            <Button ghost icon={<SearchOutlined />} type="dashed" size="small" loading></Button>
            <Button ghost icon={<SearchOutlined />} type="dashed" size="small"></Button>
            <Button ghost icon={<SearchOutlined />} type="dashed" size="small" disabled>
              Button
            </Button>

            <Button ghost danger type="dashed" size="small">
              Button
            </Button>
            <Button ghost danger type="dashed" size="small" loading>
              Button
            </Button>
            <Button ghost danger type="dashed" size="small" loading></Button>
            <Button ghost danger type="dashed" size="small" disabled>
              Button
            </Button>

            <Button ghost danger icon={<SearchOutlined />} type="dashed" size="small">
              Button
            </Button>
            <Button ghost danger icon={<SearchOutlined />} type="dashed" size="small" loading>
              Button
            </Button>
            <Button
              ghost
              danger
              icon={<SearchOutlined />}
              type="dashed"
              size="small"
              loading
            ></Button>
            <Button ghost danger icon={<SearchOutlined />} type="dashed" size="small"></Button>
            <Button ghost danger icon={<SearchOutlined />} type="dashed" size="small" disabled>
              Button
            </Button>
          </Space>

          {/* Text */}
          <Space direction="vertical">
            <Text>Ghost Text</Text>
            <Text>Small</Text>
            <Button ghost type="text" size="small">
              Button
            </Button>
            <Button ghost type="text" size="small" loading>
              Button
            </Button>
            <Button ghost type="text" size="small" loading></Button>
            <Button ghost type="text" size="small" disabled>
              Button
            </Button>

            <Button ghost icon={<SearchOutlined />} type="text" size="small">
              Button
            </Button>
            <Button ghost icon={<SearchOutlined />} type="text" size="small" loading>
              Button
            </Button>
            <Button ghost icon={<SearchOutlined />} type="text" size="small" loading></Button>
            <Button ghost icon={<SearchOutlined />} type="text" size="small"></Button>
            <Button ghost icon={<SearchOutlined />} type="text" size="small" disabled>
              Button
            </Button>

            <Button ghost danger type="text" size="small">
              Button
            </Button>
            <Button ghost danger type="text" size="small" loading>
              Button
            </Button>
            <Button ghost danger type="text" size="small" loading></Button>
            <Button ghost danger type="text" size="small" disabled>
              Button
            </Button>

            <Button ghost danger icon={<SearchOutlined />} type="text" size="small">
              Button
            </Button>
            <Button ghost danger icon={<SearchOutlined />} type="text" size="small" loading>
              Button
            </Button>
            <Button
              ghost
              danger
              icon={<SearchOutlined />}
              type="text"
              size="small"
              loading
            ></Button>
            <Button ghost danger icon={<SearchOutlined />} type="text" size="small"></Button>
            <Button ghost danger icon={<SearchOutlined />} type="text" size="small" disabled>
              Button
            </Button>
          </Space>

          {/* Link */}
          <Space direction="vertical">
            <Text>Ghost Text</Text>
            <Text>Small</Text>
            <Button ghost type="link" href="#" size="small">
              Button
            </Button>
            <Button ghost type="link" href="#" size="small" loading>
              Button
            </Button>
            <Button ghost type="link" href="#" size="small" loading></Button>
            <Button ghost type="link" href="#" size="small" disabled>
              Button
            </Button>

            <Button ghost icon={<SearchOutlined />} type="link" size="small">
              Button
            </Button>
            <Button ghost icon={<SearchOutlined />} type="link" size="small" loading>
              Button
            </Button>
            <Button ghost icon={<SearchOutlined />} type="link" size="small" loading></Button>
            <Button ghost icon={<SearchOutlined />} type="link" size="small"></Button>
            <Button ghost icon={<SearchOutlined />} type="link" size="small" disabled>
              Button
            </Button>

            <Button ghost danger type="link" size="small">
              Button
            </Button>
            <Button ghost danger type="link" size="small" loading>
              Button
            </Button>
            <Button ghost danger type="link" size="small" loading></Button>
            <Button ghost danger type="link" size="small" disabled>
              Button
            </Button>

            <Button ghost danger icon={<SearchOutlined />} type="link" size="small">
              Button
            </Button>
            <Button ghost danger icon={<SearchOutlined />} type="link" size="small" loading>
              Button
            </Button>
            <Button
              ghost
              danger
              icon={<SearchOutlined />}
              type="link"
              size="small"
              loading
            ></Button>
            <Button ghost danger icon={<SearchOutlined />} type="link" size="small"></Button>
            <Button ghost danger icon={<SearchOutlined />} type="link" size="small" disabled>
              Button
            </Button>
          </Space>
        </Space>

        {/* Dropdown */}
        <Space size={32}>
          <Text>Dropdown</Text>
          <Dropdown.Button
            key="treeFacet-footer-dropdown-button"
            type="primary"
            overlay={
              <Menu
                onClick={() => {}}
                items={[
                  {
                    key: 'test1',
                    label: 'Test 1',
                  },
                  {
                    key: 'test2',
                    label: 'Test 2',
                  },
                  {
                    key: 'test3',
                    label: 'Test 3',
                  },
                ]}
              />
            }
            style={{ marginLeft: '8px' }}
            onClick={() => {}}
          >
            Apply
          </Dropdown.Button>
        </Space>
      </Space>
    </div>
  );
};
export default FakeStorybook;
