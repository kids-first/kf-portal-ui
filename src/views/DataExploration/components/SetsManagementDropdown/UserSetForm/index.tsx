import { Col, Form, Row, Select } from 'antd';
import { Store } from 'antd/lib/form/interface';
import { FormInstance } from 'antd/lib/form';
import { IUserSetOutput, SetType } from 'services/api/savedSet/models';
import { UserOutlined } from '@ant-design/icons';

import styles from './index.module.scss';

type OwnProps = {
  formName: string;
  userSets: IUserSetOutput[];
  onFinish: (values: Store) => void;
  onSelectionChange: (values: string) => void;
  form: FormInstance;
  type: SetType;
};

const UserSetsForm = ({
  form,
  formName,
  userSets,
  onFinish,
  onSelectionChange,
  type,
}: OwnProps) => (
  <Form form={form} name={formName} onFinish={onFinish} layout="vertical">
    <Form.Item
      label={`${type.charAt(0).toUpperCase() + type.slice(1)} Set`}
      name="setId"
      className={styles.setEditFormItem}
    >
      <Select placeholder="Choose a set" onSelect={(value: string) => onSelectionChange(value)}>
        {userSets.map((s: IUserSetOutput) => (
          <Select.Option key={s.id} value={s.id}>
            <Row>
              <Col className={styles.setDropdownName}>{s.tag}</Col>
              <Col style={{ paddingRight: 2 }}>
                <UserOutlined />
              </Col>
              <Col>
                <div className={'secondary-text-color'}>{s.size}</div>
              </Col>
            </Row>
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  </Form>
);

export default UserSetsForm;
