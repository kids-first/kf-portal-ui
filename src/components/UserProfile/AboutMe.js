import React from 'react';
import { Row } from 'antd';
import PropTypes from 'prop-types';

import ContactEditForm from 'components/UserProfile/ContactEditForm';
import ContactReadOnly from 'components/UserProfile/ContactReadOnly';
import EditToggle from 'components/UserProfile/EditToggle';

import ProfileEditable from './ProfileEditable';
import ProfileReadOnly from './ProfileReadOnly';

const AboutMe = ({ canEdit, profile, updateProfileCb, isProfileUpdating }) => (
  <>
    <Row align={'middle'} className={'am-profile-row'}>
      <EditToggle
        isProfileUpdating={isProfileUpdating}
        data={profile}
        canEdit={canEdit}
        ReadOnlyComponent={ProfileReadOnly}
        EditableComponent={ProfileEditable}
        updateProfileCb={updateProfileCb}
      />
    </Row>
    <Row>
      <EditToggle
        isProfileUpdating={isProfileUpdating}
        data={profile}
        canEdit={canEdit}
        ReadOnlyComponent={ContactReadOnly}
        EditableComponent={ContactEditForm}
        updateProfileCb={updateProfileCb}
      />
    </Row>
  </>
);

AboutMe.propTypes = {
  canEdit: PropTypes.bool.isRequired,
  updateProfileCb: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  isProfileUpdating: PropTypes.bool.isRequired,
};

export default AboutMe;
