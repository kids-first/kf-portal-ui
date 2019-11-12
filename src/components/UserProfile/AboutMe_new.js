import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Row, Col } from 'antd';
import ContactReadOnly from 'components/UserProfile/ContactReadOnly';
import ContactEditForm from 'components/UserProfile/ContactEditForm';
import EditToggle from 'components/UserProfile/EditToggle';
import ProfileReadOnly from './ProfileReadOnly';
import { compose } from 'recompose';
const { Content } = Layout;

const filterContactInfoFromProfile = profile => {
  const findMeFields = ['github', 'googleScholarId', 'linkedin', 'orchid', 'twitter', 'facebook'];
  const keepKeysExceptFindMeOn = [
    'email',
    'addressLine1',
    'institution',
    'city',
    'country',
    'state',
    'phone',
    'institutionalEmail',
    'zip',
  ];

  const { entries } = Object;
  // keep only needed value from profile + add findMe elements to it, as well.
  return entries(profile).reduce(
    (reducedProfile, [profileKey, profileValue]) => {
      if (keepKeysExceptFindMeOn.includes(profileKey)) {
        return { ...reducedProfile, [profileKey]: profileValue };
      } else if (findMeFields.includes(profileKey) && Boolean(profileValue)) {
        const findMe = { ...reducedProfile.findMe, [profileKey]: profileValue };
        return { ...reducedProfile, findMe };
      }
      return reducedProfile;
    },
    { findMe: {} },
  );
};

const addDefaultBioIfEmpty = profile => {
  if (!profile.bio) {
    return {
      ...profile,
      bio: 'Share information about your professional background and your research interests',
    };
  }
};

const addDefaultStoryIfEmpty = profile => {
  if (!profile.story) {
    return {
      ...profile,
      story: "Share why your're part of the Kids First community",
    };
  }
};

const AboutMe = props => {
  const { canEdit, profile } = props;
  return (
    <Layout style={{ display: 'flex', alignItems: 'center', padding: '25px', background: '#fff' }}>
      <Content>
        <Row align={'middle'} style={{ paddingBottom: '48px' }}>
          <Col span={24}>
            <EditToggle
              data={compose(
                addDefaultBioIfEmpty,
                addDefaultStoryIfEmpty,
              )(profile)}
              canEdit={canEdit}
              ReadOnlyComponent={ProfileReadOnly}
              EditableComponent={<div />}
            />
          </Col>
        </Row>
        {
          <Row>
            <Col span={24}>
              <EditToggle
                data={filterContactInfoFromProfile(profile)}
                canEdit={canEdit}
                ReadOnlyComponent={ContactReadOnly}
                EditableComponent={ContactEditForm}
              />
            </Col>
          </Row>
        }
      </Content>
    </Layout>
  );
};

AboutMe.propTypes = {
  canEdit: PropTypes.bool.isRequired,
};

export default AboutMe;
