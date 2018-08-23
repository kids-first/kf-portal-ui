import React from 'react';
import { compose } from 'recompose';
import { EditButton, H2, H3 } from './ui';
import BasicInfoForm from 'components/forms/BasicInfoForm';
import { injectState } from 'freactal';
import { Box, ExternalLink } from 'uikit/Core';
import styled from 'react-emotion';
import EnvelopeIcon from '../../icons/EnvelopeIcon';
import MapMarkerIcon from '../../icons/MapMarkerIcon';
import PhoneIcon from '../../icons/PhoneIcon';
import Row from 'uikit/Row';
import { Section } from '../../uikit/Core';
import { withApi } from 'services/api';

const EmailLink = styled(ExternalLink)`
  text-decoration: underline;
  width: auto;
`;

const ContactItem = styled(Section)`
  line-height: 1.83;
`;

const Contact = compose(injectState, withApi)(({ effects: { setModal }, api, profile, mt }) => {
  console.log('ciaran api');
  console.log('ciaran profile', profile);
  console.log('ciaran props');

  return (
    <Box mt={mt}>
      <H2>
        Contact Information
        <EditButton
          onClick={() => {
            setModal({
              title: 'Edit Basic Information',
              component: <BasicInfoForm {...{ api }} />,
            });
          }}
        />
      </H2>

      <Row alignItems="flex-start" mb={'20px'}>
        <MapMarkerIcon height={'17px'} style={{ position: 'relative', top: '4px' }} />
        <ContactItem ml={'7px'}>
          <H3>{profile.institution}</H3>
          <div>{`${profile.addressLine1} ${profile.addressLine2}`}</div>
          <div>{`${profile.city}, ${profile.state}, ${profile.country}`}</div>
          <div>{profile.zip}</div>
        </ContactItem>
      </Row>

      <Row alignItems="center" mb={'20px'}>
        <EnvelopeIcon height={'10px'} />
        <ContactItem ml={'7px'}>
          <EmailLink bare primary bold href="mailto:simonscientist@chop.edu">
            {profile.email}
          </EmailLink>
        </ContactItem>
      </Row>

      <Row alignItems="center">
        <PhoneIcon height={'12px'} />
        <ContactItem ml={'7px'}>{profile.phone}</ContactItem>
      </Row>
    </Box>
  );
});

export default Contact;
