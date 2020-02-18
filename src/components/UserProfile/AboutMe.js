import React from 'react';
import PropTypes from 'prop-types';
import { Row } from 'antd';
import ContactReadOnly from 'components/UserProfile/ContactReadOnly';
import ContactEditForm from 'components/UserProfile/ContactEditForm';
import EditToggle from 'components/UserProfile/EditToggle';
import ProfileReadOnly from './ProfileReadOnly';
import ProfileEditable from './ProfileEditable';

const AboutMe = props => {
  const { canEdit, profile, updateProfileCb, isProfileUpdating, loggedInUser } = props;
  return (
    <React.Fragment>
      <Row align={'middle'} className={'am-profile-row'}>
        <EditToggle
          isProfileUpdating={isProfileUpdating}
          data={profile}
          canEdit={canEdit}
          loggedInUser={loggedInUser}
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
          loggedInUser={loggedInUser}
          ReadOnlyComponent={ContactReadOnly}
          EditableComponent={ContactEditForm}
          updateProfileCb={updateProfileCb}
        />
      </Row>
    </React.Fragment>
  );
};

AboutMe.propTypes = {
  canEdit: PropTypes.bool.isRequired,
  updateProfileCb: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  isProfileUpdating: PropTypes.bool.isRequired,
  loggedInUser: PropTypes.object.isRequired,
};

export default AboutMe;
