import { Button, Dropdown, Menu, Space } from 'antd';

const FakeStorybook = () => (
  <div style={{ margin: '16px' }}>
    <Space direction="vertical">
      <div>Default</div>
      <Space>
        <Button size="large">Button</Button>
        <Button size="large" disabled>
          Button
        </Button>
        <Button size="large" loading>
          Button
        </Button>
        <Button size="large" loading></Button>
        <Button size="large" danger>
          Button
        </Button>
        <Button size="large" danger disabled>
          Button
        </Button>
        <Button size="large" danger loading>
          Button
        </Button>
        <Button size="large" danger loading></Button>
      </Space>
      <Space>
        <Button>Button</Button>
        <Button disabled>Button</Button>
        <Button loading>Button</Button>
        <Button danger>Button</Button>
        <Button danger disabled>
          Button
        </Button>
        <Button danger loading>
          Button
        </Button>
        <Button danger loading></Button>
      </Space>
      <Space>
        <Button size="small">Button</Button>
        <Button size="small" disabled>
          Button
        </Button>
        <Button size="small" loading>
          Button
        </Button>
        <Button size="small" danger>
          Button
        </Button>
        <Button size="small" danger loading>
          Button
        </Button>
        <Button size="small" danger loading></Button>
      </Space>
      <div>Primary</div>
      <Space>
        <Button size="large" type="primary">
          Button
        </Button>

        <Button size="large" type="primary" disabled>
          Button
        </Button>
        <Button size="large" type="primary" loading>
          Button
        </Button>
        <Button size="large" type="primary" loading></Button>
        <Button size="large" type="primary" danger>
          Button
        </Button>
        <Button size="large" type="primary" danger disabled>
          Button
        </Button>
        <Button size="large" type="primary" danger loading>
          Button
        </Button>
        <Button size="large" type="primary" danger loading></Button>
      </Space>
      <Space>
        <Button type="primary">Button</Button>
        <Button type="primary" disabled>
          Button
        </Button>
        <Button type="primary" loading>
          Button
        </Button>
        <Button danger type="primary">
          Button
        </Button>
        <Button danger type="primary" disabled>
          Button
        </Button>
        <Button danger type="primary" loading>
          Button
        </Button>
        <Button danger type="primary" loading></Button>
      </Space>
      <Space>
        <Button size="small" type="primary">
          Button
        </Button>

        <Button size="small" type="primary" disabled>
          Button
        </Button>
        <Button size="small" type="primary" loading>
          Button
        </Button>
        <Button size="small" type="primary" danger>
          Button
        </Button>
        <Button size="small" type="primary" danger loading>
          Button
        </Button>
        <Button size="small" type="primary" danger loading></Button>
      </Space>
      <div>Text</div>
      <Button type="text">Button</Button>
      <div>Url</div>
      <Button type="link" href="dashboard">
        Button
      </Button>
      <div>Dropdown</div>
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
  </div>
);

export default FakeStorybook;
