import React, { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Avatar, Card, Checkbox, Col, Form, Input, Row, Typography } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import keycloak from 'keycloak';

import { ORCID, ROLES } from 'common/constants';
import {
  addStateInfo as updateTrackingDimension,
  TRACKING_EVENTS,
  trackUserInteraction,
} from 'services/analyticsTracking';
import { updateUser } from 'store/actionCreators/user';
import { RootState } from 'store/rootState';
import { selectUser } from 'store/selectors/users';
import { KidsFirstKeycloakTokenParsed } from 'store/tokenTypes';
import { DispatchUser, User } from 'store/userTypes';

import './roleForm.css';

const { Paragraph, Text } = Typography;

const { Meta } = Card;

export const ROLE_FORM_NAME = 'formRole';

type OwnProps = {
  submitExtraCB: () => void;
};

const mapState = (state: RootState) => ({
  user: selectUser(state) as User,
});

const mapDispatch = (dispatch: DispatchUser) => ({
  updateUser: (user: User) => dispatch(updateUser(user)),
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = OwnProps & PropsFromRedux;

const generateRoleTypes = () => ROLES.map((r) => r.type);

const getExistingRoleOrElse = (user: User) => (user?.roles || [])[0] || ROLES[0].type;

const RoleForm = ({ submitExtraCB, user, updateUser }: Props) => {
  const existingRoleOrElse = getExistingRoleOrElse(user);
  const [activeRole, setActiveRole] = useState(existingRoleOrElse);
  const [kfOptIn, setKfOptIn] = useState(false);
  const [datasetSubscriptionKfOptIn, setDatasetSubscriptionKfOptIn] = useState(false);

  const provider = (keycloak.tokenParsed as KidsFirstKeycloakTokenParsed)?.identity_provider;

  const onChangeKfOptIn = (e: CheckboxChangeEvent) => {
    setKfOptIn(e.target.checked);
  };

  const onChangeDatasetSubscriptionKfOptIn = (e: CheckboxChangeEvent) => {
    setDatasetSubscriptionKfOptIn(e.target.checked);
  };

  const onFinish = async (values: any) => {
    const subscribing: Array<string> = values.subscribing;
    await updateUser({
      ...user,
      acceptedTerms: false,
      firstName: values.firstName,
      lastName: values.lastName,
      roles: [activeRole],
      acceptedKfOptIn: subscribing.some((s) => s === 'acceptedKfOptIn'),
      acceptedDatasetSubscriptionKfOptIn: subscribing.some(
        (s) => s === 'acceptedDatasetSubscriptionKfOptIn',
      ),
    });

    updateTrackingDimension({ userRoles: user.roles });

    submitExtraCB();
  };

  return (
    <Form
      labelAlign={'left'}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 10 }}
      name={ROLE_FORM_NAME}
      initialValues={{
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email,
        roleTypes: generateRoleTypes(),
        subscribing: [],
      }}
      onFinish={onFinish}
    >
      <div className={'section-header-spacing'}>My contact information</div>
      <Form.Item
        colon={false}
        label="My first name is"
        name="firstName"
        rules={[{ required: true, message: 'First name is required' }]}
      >
        <Input size={'middle'} className={'input'} />
      </Form.Item>
      <Form.Item
        colon={false}
        label="My last name is"
        name="lastName"
        rules={[{ required: true, message: 'Last name is required' }]}
      >
        <Input size={'middle'} className={'input'} />
      </Form.Item>
      <Form.Item
        colon={false}
        label="My email address is"
        name="email"
        rules={[{ required: kfOptIn || datasetSubscriptionKfOptIn, message: 'Email is required' }]}
      >
        <Input
          size={'middle'}
          className={'input'}
          disabled={(user.email !== null && user.email !== '') || provider !== ORCID}
        />
      </Form.Item>
      <>
        <div className={'section-header-spacing'}>I can best described as</div>
        <Form.List name={'roleTypes'}>
          {(fields) => (
            <div>
              {fields.map((field) => {
                const role = ROLES[field.name];
                const isRoleSelected = activeRole === role.type;
                return (
                  // eslint-disable-next-line react/jsx-key
                  <Form.Item {...field} noStyle>
                    <Card
                      size={'small'}
                      key={role.type}
                      hoverable
                      className={isRoleSelected ? 'role-card-active role-card' : 'role-card'}
                      onClick={async () => {
                        setActiveRole(role.type);
                        await trackUserInteraction({
                          category: TRACKING_EVENTS.categories.join,
                          action: TRACKING_EVENTS.actions.userRoleSelected,
                          label: role.type,
                          value: undefined,
                        });
                      }}
                    >
                      <Meta
                        title={
                          <span>
                            <Avatar
                              className={'role-avatar'}
                              size={24}
                              icon={role.icon({ size: '24px', fill: role.color })}
                            />
                            <Text>{role.displayName}</Text>
                          </span>
                        }
                        description={role.description}
                      />
                    </Card>
                  </Form.Item>
                );
              })}
            </div>
          )}
        </Form.List>
      </>
      <div className={'section-header-spacing'}>Keeping in touch</div>
      <Form.Item name="subscribing" noStyle>
        <Checkbox.Group>
          <Row>
            <Col span={2}>
              <Checkbox value="acceptedKfOptIn" onChange={onChangeKfOptIn} />
            </Col>
            <Col span={22}>
              <Paragraph>
                I would like to receive the Kids First Data Resource Center quarterly newsletter to
                get the latest DRC news including recent study updates, new investigators and
                partners added to the effort.
              </Paragraph>
            </Col>
          </Row>
          <Row>
            <Col span={2}>
              <Checkbox
                value="acceptedDatasetSubscriptionKfOptIn"
                onChange={onChangeDatasetSubscriptionKfOptIn}
              />
            </Col>
            <Col span={22}>
              <Paragraph>
                The Gabriella Miller Kids First Data Resource Center is constantly improving the
                availability and quality of new datasets added to the Data Resource Portal. Sign up
                below to opt-in to receive updates and announcements when new datasets are available
                in the Portal.
              </Paragraph>
            </Col>
          </Row>
        </Checkbox.Group>
      </Form.Item>
    </Form>
  );
};

export default connector(RoleForm);
