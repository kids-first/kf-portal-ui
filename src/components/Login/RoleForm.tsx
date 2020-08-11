/* eslint-disable react/prop-types */
import React, { FunctionComponent, useState } from 'react';
import { withApi } from 'services/api';
// @ts-ignore
import { compose } from 'recompose';
// @ts-ignore
import { injectState } from 'freactal';
import { InjectStateProps } from 'store/freactalStateTypes';
import { Api } from 'store/apiTypes';
import { Form, Input, Checkbox, Typography, Row, Col, Card, Avatar } from 'antd';
import './roleForm.css';
import { ROLES } from 'common/constants';
import { updateProfile } from 'services/profiles';
import {
  trackUserInteraction,
  TRACKING_EVENTS,
  addStateInfo as updateTrackingDimension,
} from 'services/analyticsTracking';
import { LoggedInUser } from 'store/userTypes';

const { Paragraph, Text } = Typography;

const { Meta } = Card;

export const ROLE_FORM_NAME = 'formRole';

type OwnProps = {
  submitExtraCB: () => void;
  setIsSubmittingRoleFormCB: (isLoading: boolean) => void;
};

type Props = OwnProps & InjectStateProps & Api;

const generateRoleTypes = () => ROLES.map((r) => r.type);

const getExistingRoleOrElse = (user: LoggedInUser) => (user?.roles || [])[0] || ROLES[0].type;

const RoleForm: FunctionComponent<Props> = ({
  submitExtraCB,
  setIsSubmittingRoleFormCB,
  api,
  state: { loggedInUser },
  effects: { setUser },
}) => {
  const existingRoleOrElse = getExistingRoleOrElse(loggedInUser);
  const [activeRole, setActiveRole] = useState(existingRoleOrElse);

  const onFinish = async (values: any) => {
    //FIXME redux when fractal is removed...
    setIsSubmittingRoleFormCB(true);
    const subscribing: Array<string> = values.subscribing;
    const { email, ...rest } = loggedInUser;
    const profile = await updateProfile(api)({
      user: {
        ...rest,
        acceptedTerms: false,
        firstName: values.firstName,
        lastName: values.lastName,
        roles: [activeRole],
        acceptedKfOptIn: subscribing.some((s) => s === 'acceptedKfOptIn'),
        acceptedNihOptIn: subscribing.some((s) => s === 'acceptedNihOptIn'),
        acceptedDatasetSubscriptionKfOptIn: subscribing.some(
          (s) => s === 'acceptedDatasetSubscriptionKfOptIn',
        ),
      },
    });
    await setUser({ ...profile, email, api, isJoining: true });
    updateTrackingDimension({ userRoles: profile.roles });
    setIsSubmittingRoleFormCB(false);
    submitExtraCB();
  };

  return (
    <Form
      labelAlign={'left'}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 10 }}
      name={ROLE_FORM_NAME}
      initialValues={{
        firstName: loggedInUser.firstName || '',
        lastName: loggedInUser.lastName || '',
        email: loggedInUser.email,
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
        rules={[{ required: false }]}
      >
        <Input size={'middle'} className={'input'} disabled />
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
              <Checkbox value="acceptedKfOptIn" />
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
              <Checkbox value="acceptedNihOptIn" />
            </Col>
            <Col span={22}>
              <Paragraph>
                I would like to receive updates from the NIH Kids First program including funding
                updates and news about the program.
              </Paragraph>
            </Col>
          </Row>
          <Row>
            <Col span={2}>
              <Checkbox value="acceptedDatasetSubscriptionKfOptIn" />
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

export default compose(injectState, withApi)(RoleForm);
